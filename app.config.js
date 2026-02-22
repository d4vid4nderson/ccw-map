const appJson = require('./app.json');

const downloadToken =
  process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN ||
  process.env.MAPBOX_SECRET_TOKEN ||
  'YOUR_MAPBOX_SECRET_TOKEN';

const plugins = (appJson.expo.plugins || []).map((plugin) => {
  if (Array.isArray(plugin) && plugin[0] === '@rnmapbox/maps') {
    return [
      '@rnmapbox/maps',
      {
        ...(plugin[1] || {}),
        RNMapboxMapsDownloadToken: downloadToken,
      },
    ];
  }
  return plugin;
});

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins,
  },
};
