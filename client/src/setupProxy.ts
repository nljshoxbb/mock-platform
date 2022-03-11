const proxy = require("http-proxy-middleware");
console.log("666");

module.exports = function (app) {
  app.use(
    "/api",
    proxy({
      target: "http://192.168.21.103:3888/",
      changeOrigin: true,
      PathRewrite: {
        "^/api": "",
      },
    })
  );
};
