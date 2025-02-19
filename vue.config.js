const path = require('path');

module.exports = {
    transpileDependencies: true,
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://web:8000',
                changeOrigin: true,
            },
        },
    },
    publicPath: '/',
    outputDir: 'dist',
    configureWebpack: {
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    },
};
