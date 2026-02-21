// Mapbox configuration
// Set EXPO_PUBLIC_MAPBOX_TOKEN in your environment or .env file
export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

// US center coordinates
export const US_CENTER: [number, number] = [-98.5795, 39.8283];
export const US_ZOOM = 3;

// GeoJSON source for US state boundaries (US Census Bureau)
export const US_STATES_GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
