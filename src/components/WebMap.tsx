import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, US_CENTER, US_ZOOM, US_STATES_GEOJSON_URL } from '../constants/mapbox';
import { stateNameToCode } from '../hooks/useMapbox';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';

interface WebMapProps {
  selectedState: string | null;
  onStatePress: (stateCode: string, shiftKey: boolean) => void;
  getStateColor: (stateCode: string) => string;
}

export function WebMap({ selectedState, onStatePress, getStateColor }: WebMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const onStatePressRef = useRef(onStatePress);
  onStatePressRef.current = onStatePress;
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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

          // Click handler — detect shift key for compare mode
          mapInstance.on('click', 'state-fills', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.GeoJSONFeature[] }) => {
            if (e.features && e.features.length > 0) {
              const stateCode = e.features[0].properties?.stateCode;
              if (stateCode) {
                const shiftKey = (e.originalEvent as MouseEvent)?.shiftKey ?? false;
                onStatePressRef.current(stateCode, shiftKey);
              }
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

  const handleRecenter = useCallback(() => {
    if (map.current) {
      map.current.flyTo({
        center: US_CENTER,
        zoom: US_ZOOM,
        duration: 800,
      });
    }
  }, []);

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
      <Pressable style={s.recenterButton} onPress={handleRecenter}>
        <Text style={s.recenterIcon}>⌖</Text>
      </Pressable>
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
    recenterButton: {
      position: 'absolute',
      bottom: 24,
      left: 12,
      backgroundColor: theme.overlay,
      borderRadius: 8,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    recenterIcon: {
      color: theme.text,
      fontSize: 20,
      lineHeight: 22,
    },
  });
}
