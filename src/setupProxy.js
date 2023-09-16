const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:3001',
      target: process.env.REACT_APP_FETCH_URL,
      changeOrigin: true,
    }),
  );
};
