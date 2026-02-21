import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
  const map = useRef<any>(null);

  const updateColors = useCallback(() => {
    if (!map.current || !map.current.getSource('states')) return;

    const colorExpression: any[] = ['match', ['get', 'stateCode']];
    for (const [name, code] of Object.entries(stateNameToCode)) {
      colorExpression.push(code, getStateColor(code));
    }
    colorExpression.push(Colors.reciprocity.default);

    map.current.setPaintProperty('state-fills', 'fill-color', colorExpression);
  }, [getStateColor]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !mapContainer.current) return;

    const mapboxgl = require('mapbox-gl');
    require('mapbox-gl/dist/mapbox-gl.css');

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
        for (const feature of geojson.features) {
          const name = feature.properties.name;
          feature.properties.stateCode = stateNameToCode[name] || '';
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
            'fill-color': colorExpression,
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.85,
              0.7,
            ],
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

        // Hover effect
        let hoveredStateId: string | null = null;

        mapInstance.on('mousemove', 'state-fills', (e: any) => {
          if (e.features && e.features.length > 0) {
            if (hoveredStateId !== null) {
              mapInstance.setFeatureState(
                { source: 'states', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = e.features[0].id;
            mapInstance.setFeatureState(
              { source: 'states', id: hoveredStateId },
              { hover: true }
            );
            mapInstance.getCanvas().style.cursor = 'pointer';
          }
        });

        mapInstance.on('mouseleave', 'state-fills', () => {
          if (hoveredStateId !== null) {
            mapInstance.setFeatureState(
              { source: 'states', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
          mapInstance.getCanvas().style.cursor = '';
        });

        // Click handler
        mapInstance.on('click', 'state-fills', (e: any) => {
          if (e.features && e.features.length > 0) {
            const stateCode = e.features[0].properties.stateCode;
            if (stateCode) {
              onStatePress(stateCode);
            }
          }
        });
      } catch (error) {
        console.error('Failed to load GeoJSON:', error);
      }
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Update colors when selection changes
  useEffect(() => {
    updateColors();
  }, [selectedState, updateColors]);

  if (Platform.OS !== 'web') {
    return <View style={styles.container} />;
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
});
