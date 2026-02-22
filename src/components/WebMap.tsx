import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, US_CENTER, US_ZOOM, US_STATES_GEOJSON_URL } from '../constants/mapbox';
import { stateNameToCode } from '../hooks/useMapbox';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { stateLaws } from '../data/stateLaws';
import { getReciprocitySummary } from '../data/reciprocity';

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
    button.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
      <path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-4.5-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm9 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM10 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
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

function buildPopupHTML(stateCode: string, theme: Theme): string {
  const law = stateLaws[stateCode];
  if (!law) return '';
  const reciprocity = getReciprocitySummary(stateCode);

  const permitLabel =
    law.permitType === 'unrestricted' ? 'Unrestricted'
    : law.permitType === 'shall-issue' ? 'Shall-Issue'
    : law.permitType === 'may-issue' ? 'May-Issue'
    : 'No-Issue';
  const permitColor = theme.permitType[law.permitType];

  const isDark = theme.name === 'dark' || theme.name === 'multicam-black';

  return `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-width: 220px;
      max-width: 280px;
    ">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <div>
          <div style="font-size:16px; font-weight:700; color:${theme.text};">${law.stateName}</div>
          <div style="font-size:11px; color:${theme.textSecondary};">${law.stateCode}</div>
        </div>
        <div style="
          background:${permitColor}; color:#fff; font-size:10px; font-weight:700;
          padding:3px 8px; border-radius:5px; white-space:nowrap;
        ">${permitLabel}</div>
      </div>
      <div style="font-size:12px; color:${theme.textSecondary}; line-height:1.4; margin-bottom:10px;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
        ${law.summary}
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <div style="text-align:center; flex:1;">
          <div style="font-size:14px; font-weight:700; color:${theme.text};">${reciprocity.honoredByCount}</div>
          <div style="font-size:9px; color:${theme.textMuted};">States Honor</div>
        </div>
        <div style="text-align:center; flex:1;">
          <div style="font-size:14px; font-weight:700; color:${theme.text};">${law.permitlessCarry ? 'Yes' : 'No'}</div>
          <div style="font-size:9px; color:${theme.textMuted};">Permitless</div>
        </div>
        <div style="text-align:center; flex:1;">
          <div style="font-size:14px; font-weight:700; color:${theme.text};">${law.standYourGround ? 'Yes' : 'No'}</div>
          <div style="font-size:9px; color:${theme.textMuted};">Stand Ground</div>
        </div>
        <div style="text-align:center; flex:1;">
          <div style="font-size:14px; font-weight:700; color:${theme.text};">${law.magazineRestriction ?? 'None'}</div>
          <div style="font-size:9px; color:${theme.textMuted};">Mag Limit</div>
        </div>
      </div>
      <div style="display:flex; gap:6px;">
        <button data-action="more" style="
          flex:1; padding:7px 0; border:none; border-radius:6px; cursor:pointer;
          background:${theme.primary}; color:#fff; font-size:12px; font-weight:600;
        ">More</button>
        <button data-action="compare" style="
          padding:7px 12px; border:none; border-radius:6px; cursor:pointer;
          background:${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          color:${theme.textSecondary}; font-size:12px; font-weight:600;
        ">Compare</button>
      </div>
    </div>
  `;
}

interface WebMapProps {
  selectedState: string | null;
  onStatePress: (stateCode: string, shiftKey: boolean) => void;
  onMore: (stateCode: string) => void;
  onCompare: (stateCode: string) => void;
  getStateColor: (stateCode: string) => string;
}

export function WebMap({ selectedState, onStatePress, onMore, onCompare, getStateColor }: WebMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const onStatePressRef = useRef(onStatePress);
  onStatePressRef.current = onStatePress;
  const onMoreRef = useRef(onMore);
  onMoreRef.current = onMore;
  const onCompareRef = useRef(onCompare);
  onCompareRef.current = onCompare;
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const updateColors = useCallback(() => {
    if (!map.current || !map.current.getSource('states')) return;

    const colorExpression: any[] = ['match', ['get', 'stateCode']];
    for (const code of Object.values(stateNameToCode)) {
      colorExpression.push(code, getStateColor(code));
    }
    colorExpression.push(theme.reciprocity.default);

    try {
      map.current.setPaintProperty('state-fills', 'fill-color', colorExpression as any);
    } catch (e) {
      // Layer may not be ready yet
    }
  }, [getStateColor, theme]);

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
        style: 'mapbox://styles/david4nderson/cmlwkl3dj000501s7dymn31sm',
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

          // Add stateCode property to each feature
          if (geojson && Array.isArray(geojson.features)) {
            for (const feature of geojson.features) {
              const name = feature.properties?.name;
              if (name) {
                feature.properties.stateCode = stateNameToCode[name] || '';
              }
            }
          }

          mapInstance.addSource('states', {
            type: 'geojson',
            data: geojson,
          });

          // Build initial color expression
          const colorExpression: any[] = ['match', ['get', 'stateCode']];
          for (const code of Object.values(stateNameToCode)) {
            colorExpression.push(code, getStateColor(code));
          }
          colorExpression.push(theme.reciprocity.default);

          // Hide country labels (e.g. "United States") so they don't cover states
          const styleLayers = mapInstance.getStyle().layers || [];
          for (const layer of styleLayers) {
            if (layer.id.includes('country-label') || layer.id.includes('continent-label')) {
              mapInstance.setLayoutProperty(layer.id, 'visibility', 'none');
            }
          }

          mapInstance.addLayer({
            id: 'state-fills',
            type: 'fill',
            source: 'states',
            paint: {
              'fill-color': colorExpression as any,
              'fill-opacity': 0.5,
            },
          });

          mapInstance.addLayer({
            id: 'state-borders',
            type: 'line',
            source: 'states',
            paint: {
              'line-color': theme.map.borderColor,
              'line-width': 1,
              'line-opacity': theme.map.borderOpacity,
            },
          });

          // Hover effect via cursor change
          mapInstance.on('mouseenter', 'state-fills', () => {
            mapInstance.getCanvas().style.cursor = 'pointer';
          });

          mapInstance.on('mouseleave', 'state-fills', () => {
            mapInstance.getCanvas().style.cursor = '';
          });

          // Click handler — show popup with state info
          mapInstance.on('click', 'state-fills', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.GeoJSONFeature[] }) => {
            if (e.features && e.features.length > 0) {
              const stateCode = e.features[0].properties?.stateCode;
              if (!stateCode) return;

              const shiftKey = (e.originalEvent as MouseEvent)?.shiftKey ?? false;
              onStatePressRef.current(stateCode, shiftKey);

              // Don't show popup for shift-clicks (compare mode)
              if (shiftKey) return;

              // Remove existing popup
              if (popup.current) {
                popup.current.remove();
                popup.current = null;
              }

              const currentTheme = themeRef.current;
              const html = buildPopupHTML(stateCode, currentTheme);
              if (!html) return;

              const newPopup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: false,
                maxWidth: '300px',
                className: 'state-popup',
              })
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(mapInstance);

              // Wire up button clicks inside the popup
              const container = newPopup.getElement();
              container?.addEventListener('click', (evt) => {
                const target = evt.target as HTMLElement;
                const btn = target.closest('button');
                if (!btn) return;
                const action = btn.getAttribute('data-action');
                if (action === 'more') {
                  newPopup.remove();
                  popup.current = null;
                  onMoreRef.current(stateCode);
                } else if (action === 'compare') {
                  newPopup.remove();
                  popup.current = null;
                  onCompareRef.current(stateCode);
                }
              });

              newPopup.on('close', () => {
                popup.current = null;
              });

              popup.current = newPopup;
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

  // Update colors when selection changes
  useEffect(() => {
    updateColors();
  }, [selectedState, updateColors]);

  // Inject popup styles that match the current theme
  useEffect(() => {
    const isDark = theme.name === 'dark' || theme.name === 'multicam-black';
    const styleId = 'state-popup-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .state-popup .mapboxgl-popup-content {
        background: ${theme.surface};
        border: 1px solid ${theme.border};
        border-radius: 10px;
        padding: 14px;
        box-shadow: 0 4px 16px rgba(0,0,0,${isDark ? '0.5' : '0.15'});
      }
      .state-popup .mapboxgl-popup-tip {
        border-top-color: ${theme.surface};
      }
      .state-popup.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        border-top-color: ${theme.surface};
      }
      .state-popup.mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
        border-bottom-color: ${theme.surface};
      }
      .state-popup.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
        border-right-color: ${theme.surface};
      }
      .state-popup.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
        border-left-color: ${theme.surface};
      }
      .state-popup .mapboxgl-popup-close-button {
        color: ${theme.textMuted};
        font-size: 18px;
        padding: 4px 8px;
      }
      .state-popup .mapboxgl-popup-close-button:hover {
        color: ${theme.text};
        background: transparent;
      }
    `;
  }, [theme]);

  // Close popup when selectedState is cleared externally
  useEffect(() => {
    if (!selectedState && popup.current) {
      popup.current.remove();
      popup.current = null;
    }
  }, [selectedState]);

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
