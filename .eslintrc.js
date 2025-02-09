
module.exports = {
  // ...existing code...
  rules: {
    // ...existing code...
    'source-map-loader/no-missing-source-maps': 'off'
  },
  overrides: [{
    files: ['**/node_modules/@mediapipe/**'],
    rules: {
      'source-map-loader/no-missing-source-maps': 'off'
    }
  }]
  // ...existing code...
};