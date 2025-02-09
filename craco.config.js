module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Ignore source-map-loader for @mediapipe
            webpackConfig.module.rules.forEach((rule) => {
                if (rule.enforce === 'pre' && rule.use) {
                    rule.exclude = /node_modules\/@mediapipe/;
                }
            });
            return webpackConfig;
        }
    }
};
