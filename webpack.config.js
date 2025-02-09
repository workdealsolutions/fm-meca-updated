const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/@mediapipe/,
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["eslint-loader"],
        exclude: /node_modules/,
      }
    ]
  },
  ignoreWarnings: [
    /Failed to parse source map/
  ]
};