import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_URL, US_CENTER, US_ZOOM, US_STATES_GEOJSON_URL } from '../constants/mapbox';
import { stateNameToCode } from '../hooks/useMapbox';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';

// Custom Mapbox control that recenters the map to the default US view
class RecenterControl implements mapboxgl.IControl {
  private _container: HTMLDivElement | null = null;
  private _map: mapboxgl.Map | null = null;

  onAdd(map: mapboxgl.Map): HTMLElement {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'Reset view';
    button.setAttribute('aria-label', 'Reset view');
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
    </svg>`;
    button.addEventListener('click', () => {
      this._map?.flyTo({
        center: US_CENTER,
        zoom: US_ZOOM,
        duration: 800,
      });
    });

    this._container.appendChild(button);
    return this._container;
  }

  onRemove(): void {
    this._container?.parentNode?.removeChild(this._container);
    this._map = null;
  }
}

interface WebMapProps {
  selectedState: string | null;
  onStatePress: (stateCode: string, shiftKey: boolean) => void;
  onDeselect?: () => void;
  getStateColor: (stateCode: string) => string;
  focusStateCode?: string | null;
  focusStateRequestId?: number;
  resetViewRequestId?: number;
  leftOffset?: number;
  highlightStateCode?: string | null;
  mapStyleUrl?: string;
  connectStateA?: string | null;
  connectStateB?: string | null;
  onLineMidpoint?: (x: number, y: number) => void;
}

type BoundsTuple = [number, number, number, number];

function collectBounds(coords: any, bounds: BoundsTuple): void {
  if (!Array.isArray(coords) || coords.length === 0) return;
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    const lng = coords[0];
    const lat = coords[1];
    bounds[0] = Math.min(bounds[0], lng);
    bounds[1] = Math.min(bounds[1], lat);
    bounds[2] = Math.max(bounds[2], lng);
    bounds[3] = Math.max(bounds[3], lat);
    return;
  }
  for (const child of coords) {
    collectBounds(child, bounds);
  }
}

function getFeatureBounds(feature: any): BoundsTuple | null {
  const geometry = feature?.geometry;
  if (!geometry?.coordinates) return null;
  const bounds: BoundsTuple = [Infinity, Infinity, -Infinity, -Infinity];
  collectBounds(geometry.coordinates, bounds);
  if (!Number.isFinite(bounds[0])) return null;
  return bounds;
}

const CONNECTION_SOURCE = 'connection-line';
const CONNECTION_LAYER = 'connection-line-layer';

export function WebMap({
  selectedState,
  onStatePress,
  onDeselect,
  getStateColor,
  focusStateCode = null,
  focusStateRequestId = 0,
  resetViewRequestId = 0,
  leftOffset = 0,
  highlightStateCode = null,
  mapStyleUrl,
  connectStateA = null,
  connectStateB = null,
  onLineMidpoint,
}: WebMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const onStatePressRef = useRef(onStatePress);
  onStatePressRef.current = onStatePress;
  const onDeselectRef = useRef(onDeselect);
  onDeselectRef.current = onDeselect;
  const stateBoundsRef = useRef<Record<string, BoundsTuple>>({});
  const onLineMidpointRef = useRef(onLineMidpoint);
  onLineMidpointRef.current = onLineMidpoint;
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Live refs so callbacks always see current values without stale closure
  const geojsonDataRef = useRef<any>(null);
  const getStateColorRef = useRef(getStateColor);
  getStateColorRef.current = getStateColor;
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const highlightStateCodeRef = useRef(highlightStateCode);
  highlightStateCodeRef.current = highlightStateCode;
  const loadedStyleUrlRef = useRef<string>('');
  const resolvedStyleUrl = mapStyleUrl ?? MAPBOX_STYLE_URL;
  const resolvedStyleUrlRef = useRef(resolvedStyleUrl);
  resolvedStyleUrlRef.current = resolvedStyleUrl;

  // Adds/restores state source + layers onto a freshly-loaded map style.
  // Uses refs so it always reads current theme/color values.
  const setupStateLayers = useCallback((m: mapboxgl.Map) => {
    const geojson = geojsonDataRef.current;
    if (!geojson) return;

    try { if (m.getLayer('state-fills')) m.removeLayer('state-fills'); } catch (_) {}
    try { if (m.getLayer('state-borders')) m.removeLayer('state-borders'); } catch (_) {}
    try { if (m.getSource('states')) m.removeSource('states'); } catch (_) {}

    // Hide country/continent labels so they don't cover state names
    const styleLayers = m.getStyle().layers || [];
    for (const layer of styleLayers) {
      if (layer.id.includes('country-label') || layer.id.includes('continent-label')) {
        m.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    }

    m.addSource('states', { type: 'geojson', data: geojson });

    const colorExpression: any[] = ['match', ['get', 'stateCode']];
    for (const code of Object.values(stateNameToCode)) {
      colorExpression.push(code, getStateColorRef.current(code));
    }
    colorExpression.push(themeRef.current.reciprocity.default);

    const hsc = highlightStateCodeRef.current;
    const baseOpacity = themeRef.current.map.fillOpacity;
    // Highlighted state uses a lower opacity so the map is visible through the fill
    const opacityExpression: any = hsc
      ? ['match', ['get', 'stateCode'], hsc, 0.4, baseOpacity]
      : baseOpacity;

    m.addLayer({
      id: 'state-fills',
      type: 'fill',
      source: 'states',
      paint: {
        'fill-color': colorExpression as any,
        'fill-opacity': opacityExpression as any,
      },
    });

    m.addLayer({
      id: 'state-borders',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': themeRef.current.map.borderColor,
        'line-width': 1,
        'line-opacity': themeRef.current.map.borderOpacity,
      },
    });

    m.on('mouseenter', 'state-fills', () => {
      m.getCanvas().style.cursor = 'pointer';
    });
    m.on('mouseleave', 'state-fills', () => {
      m.getCanvas().style.cursor = '';
    });
  }, []);

  const updateColors = useCallback(() => {
    if (!map.current || !map.current.getSource('states')) return;

    const colorExpression: any[] = ['match', ['get', 'stateCode']];
    for (const code of Object.values(stateNameToCode)) {
      colorExpression.push(code, getStateColor(code));
    }
    colorExpression.push(theme.reciprocity.default);

    const hsc = highlightStateCode;
    const baseOpacity = theme.map.fillOpacity;
    const opacityExpression: any = hsc
      ? ['match', ['get', 'stateCode'], hsc, 0.4, baseOpacity]
      : baseOpacity;

    try {
      map.current.setPaintProperty('state-fills', 'fill-color', colorExpression as any);
      map.current.setPaintProperty('state-fills', 'fill-opacity', opacityExpression);
    } catch (e) {
      // Layer may not be ready yet
    }
  }, [getStateColor, theme, highlightStateCode]);

  // Update border colors when theme changes
  useEffect(() => {
    if (!map.current || !map.current.getSource('states')) return;
    try {
      map.current.setPaintProperty('state-borders', 'line-color', theme.map.borderColor);
      map.current.setPaintProperty('state-borders', 'line-opacity', theme.map.borderOpacity);
    } catch (e) {
      // Layer may not be ready yet
    }
  }, [theme]);

  // Map initialisation — deps intentionally [] — do NOT modify
  useEffect(() => {
    if (Platform.OS !== 'web' || !mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      if (!MAPBOX_ACCESS_TOKEN) {
        setError('Mapbox token not configured. Set EXPO_PUBLIC_MAPBOX_TOKEN env variable.');
        return;
      }

      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: resolvedStyleUrlRef.current,
        center: US_CENTER,
        zoom: US_ZOOM,
        minZoom: 2,
        maxZoom: 8,
        attributionControl: false,
      });

      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstance.addControl(new RecenterControl(), 'top-right');

      mapInstance.on('load', async () => {
        try {
          const response = await fetch(US_STATES_GEOJSON_URL);
          const geojson = await response.json();

          // Add stateCode property to each feature and compute bounds
          if (geojson && Array.isArray(geojson.features)) {
            const nextBounds: Record<string, BoundsTuple> = {};
            for (const feature of geojson.features) {
              const name = feature.properties?.name || feature.properties?.STATE_NAME;
              if (name) {
                feature.properties.stateCode =
                  stateNameToCode[name] ||
                  feature.properties?.stateCode ||
                  feature.properties?.STATE_ID ||
                  '';
                const stateCode = feature.properties.stateCode;
                if (stateCode) {
                  const featureBounds = getFeatureBounds(feature);
                  if (featureBounds) {
                    nextBounds[stateCode] = featureBounds;
                  }
                }
              }
            }
            stateBoundsRef.current = nextBounds;
          }

          geojsonDataRef.current = geojson;
          setupStateLayers(mapInstance);
          loadedStyleUrlRef.current = resolvedStyleUrlRef.current;

          // Click handler — state click OR deselect when clicking empty map
          mapInstance.on('click', (e: mapboxgl.MapMouseEvent) => {
            const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['state-fills'] });
            if (features.length > 0) {
              const stateCode = features[0].properties?.stateCode;
              if (stateCode) {
                const shiftKey = (e.originalEvent as MouseEvent)?.shiftKey ?? false;
                onStatePressRef.current(stateCode, shiftKey);
              }
            } else {
              onDeselectRef.current?.();
            }
          });
        } catch (err) {
          console.error('Failed to load GeoJSON:', err);
          setError('Failed to load state boundaries');
        }
      });

      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      map.current = mapInstance;

      return () => {
        mapInstance.remove();
        map.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map');
    }
  }, []);

  // Switch map style when the theme changes (e.g. Night Ops uses a dark base style)
  useEffect(() => {
    if (!map.current || !loadedStyleUrlRef.current) return;
    if (resolvedStyleUrl === loadedStyleUrlRef.current) return;

    loadedStyleUrlRef.current = resolvedStyleUrl;
    map.current.setStyle(resolvedStyleUrl);

    map.current.once('style.load', () => {
      if (!map.current) return;
      setupStateLayers(map.current);
    });
  }, [resolvedStyleUrl, setupStateLayers]);

  // Update colors when selection changes
  useEffect(() => {
    updateColors();
  }, [selectedState, updateColors]);

  useEffect(() => {
    if (!focusStateCode || focusStateRequestId <= 0 || !map.current) return;
    const bounds = stateBoundsRef.current[focusStateCode];
    if (!bounds) return;
    map.current.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        padding: { top: 40, bottom: 40, left: leftOffset + 40, right: 40 },
        duration: 800,
        maxZoom: 5.5,
      }
    );
  }, [focusStateCode, focusStateRequestId, leftOffset]);

  useEffect(() => {
    if (resetViewRequestId <= 0 || !map.current) return;
    map.current.flyTo({
      center: US_CENTER,
      zoom: US_ZOOM,
      duration: 800,
    });
  }, [resetViewRequestId]);

  // Connection line effect — draws an animated dashed line between two state centroids
  useEffect(() => {
    if (!map.current) return;

    const m = map.current;

    // Helper: remove existing connection source and layer
    function removeConnection() {
      try {
        if (m.getLayer(CONNECTION_LAYER)) {
          m.removeLayer(CONNECTION_LAYER);
        }
      } catch (_) {}
      try {
        if (m.getSource(CONNECTION_SOURCE)) {
          m.removeSource(CONNECTION_SOURCE);
        }
      } catch (_) {}
    }

    // Both states must be set and their bounds must be known
    if (!connectStateA || !connectStateB) {
      removeConnection();
      return;
    }

    const boundsA = stateBoundsRef.current[connectStateA];
    const boundsB = stateBoundsRef.current[connectStateB];

    // Bounds may not be loaded yet if the map hasn't finished its initial load.
    // We check the 'states' source as a proxy for the GeoJSON having loaded.
    if (!boundsA || !boundsB) {
      // Retry once the map has loaded if it isn't yet
      if (!m.getSource('states')) {
        const onLoad = () => {
          drawConnection();
        };
        m.once('idle', onLoad);
        return () => {
          m.off('idle', onLoad);
        };
      }
      return;
    }

    function drawConnection() {
      if (!map.current) return;
      const mRef = map.current;

      const bA = stateBoundsRef.current[connectStateA!];
      const bB = stateBoundsRef.current[connectStateB!];
      if (!bA || !bB) return;

      const lngA = (bA[0] + bA[2]) / 2;
      const latA = (bA[1] + bA[3]) / 2;
      const lngB = (bB[0] + bB[2]) / 2;
      const latB = (bB[1] + bB[3]) / 2;

      const midLng = (lngA + lngB) / 2;
      const midLat = (latA + latB) / 2;

      const geojsonData: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [lngA, latA],
            [lngB, latB],
          ],
        },
      };

      // Remove stale source/layer before (re)adding
      try {
        if (mRef.getLayer(CONNECTION_LAYER)) mRef.removeLayer(CONNECTION_LAYER);
      } catch (_) {}
      try {
        if (mRef.getSource(CONNECTION_SOURCE)) mRef.removeSource(CONNECTION_SOURCE);
      } catch (_) {}

      mRef.addSource(CONNECTION_SOURCE, {
        type: 'geojson',
        data: geojsonData,
      });

      mRef.addLayer({
        id: CONNECTION_LAYER,
        type: 'line',
        source: CONNECTION_SOURCE,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#ffffff',
          'line-opacity': 0.85,
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      });

      // Helper to project midpoint to screen and fire callback
      function reportMidpoint() {
        if (!map.current) return;
        try {
          const point = map.current.project([midLng, midLat]);
          onLineMidpointRef.current?.(point.x, point.y);
        } catch (_) {}
      }

      // Compute combined bounds for both states
      const combinedSW: [number, number] = [
        Math.min(bA[0], bB[0]),
        Math.min(bA[1], bB[1]),
      ];
      const combinedNE: [number, number] = [
        Math.max(bA[2], bB[2]),
        Math.max(bA[3], bB[3]),
      ];

      mRef.fitBounds([combinedSW, combinedNE], {
        padding: {
          top: 60,
          bottom: 60,
          left: leftOffset + 60,
          right: 60,
        },
        duration: 900,
      });

      // After fitBounds settles, report midpoint; also track on subsequent moves
      mRef.once('moveend', () => {
        reportMidpoint();
        // Re-report whenever the user pans/zooms while connection is active
        mRef.on('moveend', reportMidpoint);
      });
    }

    // The map style may still be loading; wait for idle before drawing
    if (!m.isStyleLoaded()) {
      const onIdle = () => drawConnection();
      m.once('idle', onIdle);
      return () => {
        m.off('idle', onIdle);
      };
    }

    drawConnection();

    return () => {
      if (!map.current) return;
      try {
        if (map.current.getLayer(CONNECTION_LAYER)) {
          map.current.removeLayer(CONNECTION_LAYER);
        }
      } catch (_) {}
      try {
        if (map.current.getSource(CONNECTION_SOURCE)) {
          map.current.removeSource(CONNECTION_SOURCE);
        }
      } catch (_) {}
    };
  }, [connectStateA, connectStateB, leftOffset]);

  const s = makeStyles(theme);

  if (Platform.OS !== 'web') {
    return <View style={s.container} />;
  }

  if (error) {
    return (
      <View style={[s.container, s.errorContainer]}>
        <Text style={s.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <div ref={mapContainer as any} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: theme.warning,
      fontSize: 14,
      textAlign: 'center',
    },
  });
}
