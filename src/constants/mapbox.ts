// Mapbox configuration
// Set EXPO_PUBLIC_MAPBOX_TOKEN in your environment or .env file
export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';
export const MAPBOX_STYLE_URL =
  process.env.EXPO_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/david4nderson/cmlwkl3dj000501s7dymn31sm';

// US center coordinates — tuned to show the full contiguous US + Alaska in the viewport
export const US_CENTER: [number, number] = [-99.0, 37.5];
export const US_ZOOM = 3.3;

// GeoJSON source for US state boundaries (US Census Bureau)
export const US_STATES_GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
