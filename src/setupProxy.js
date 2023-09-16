const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://d25e-211-198-25-134.ngrok-free.app',
      changeOrigin: true,
    }),
  );
};
