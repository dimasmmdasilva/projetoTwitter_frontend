const path = require('path');

module.exports = {
    transpileDependencies: true,
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://projetofinal-back-end.onrender.com', // Usa o nome do serviço no Docker
                changeOrigin: true,
            },
        },
    },
    publicPath: '/',
    outputDir: 'dist',
    configureWebpack: {
        // Otimiza a build para o ambiente de produção
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'), // Mapeia @ para a pasta src
            },
        },
    },
};
