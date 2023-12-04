const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://port-0-webbuilder-back-5mk12alp6dco7g.sel5.cloudtype.app/',
      changeOrigin: true,
    }),
  );
};
