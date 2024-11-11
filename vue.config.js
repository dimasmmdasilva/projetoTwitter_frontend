const path = require('path');

module.exports = {
    transpileDependencies: true, // Transpila automaticamente dependências para compatibilidade
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://web:8000', // Usa o nome do serviço no Docker
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
