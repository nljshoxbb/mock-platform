const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    proxy({
      target: 'http://nljshoxbb.natapp1.cc',
      changeOrigin: true,
      PathRewrite: {
        '^/api': ''
      }
    })
  );
};
