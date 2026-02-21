import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, US_CENTER, US_ZOOM, US_STATES_GEOJSON_URL } from '../constants/mapbox';
import { stateNameToCode } from '../hooks/useMapbox';
import { Colors } from '../constants/colors';

interface WebMapProps {
  selectedState: string | null;
  onStatePress: (stateCode: string) => void;
  getStateColor: (stateCode: string) => string;
}

export function WebMap({ selectedState, onStatePress, getStateColor }: WebMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateColors = useCallback(() => {
    if (!map.current || !map.current.getSource('states')) return;

    const colorExpression: any[] = ['match', ['get', 'stateCode']];
    for (const code of Object.values(stateNameToCode)) {
      colorExpression.push(code, getStateColor(code));
    }
    colorExpression.push(Colors.reciprocity.default);

    try {
      map.current.setPaintProperty('state-fills', 'fill-color', colorExpression as any);
    } catch (e) {
      // Layer may not be ready yet
    }
  }, [getStateColor]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      if (MAPBOX_ACCESS_TOKEN === 'YOUR_MAPBOX_PUBLIC_TOKEN') {
        setError('Mapbox token not configured. Update src/constants/mapbox.ts');
        return;
      }

      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
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
          colorExpression.push(Colors.reciprocity.default);

          mapInstance.addLayer({
            id: 'state-fills',
            type: 'fill',
            source: 'states',
            paint: {
              'fill-color': colorExpression as any,
              'fill-opacity': 0.7,
            },
          });

          mapInstance.addLayer({
            id: 'state-borders',
            type: 'line',
            source: 'states',
            paint: {
              'line-color': '#ffffff',
              'line-width': 1,
              'line-opacity': 0.4,
            },
          });

          // Hover effect via cursor change
          mapInstance.on('mouseenter', 'state-fills', () => {
            mapInstance.getCanvas().style.cursor = 'pointer';
          });

          mapInstance.on('mouseleave', 'state-fills', () => {
            mapInstance.getCanvas().style.cursor = '';
          });

          // Click handler
          mapInstance.on('click', 'state-fills', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.GeoJSONFeature[] }) => {
            if (e.features && e.features.length > 0) {
              const stateCode = e.features[0].properties?.stateCode;
              if (stateCode) {
                onStatePress(stateCode);
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

  if (Platform.OS !== 'web') {
    return <View style={styles.container} />;
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div ref={mapContainer as any} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.warning,
    fontSize: 14,
    textAlign: 'center',
  },
});
