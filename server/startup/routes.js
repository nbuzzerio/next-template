const express = require("express");
const endpoints = require("../routes/example");
const auth = require("../routes/auth");
const users = require("../routes/users");
const products = require("../routes/products");
const error = require("../middleware/error");

module.exports = function (server) {
  server.use(express.json());
  server.use((req, res, next) => {
    res.set("Content-Security-Policy", "script-src 'self' 'unsafe-eval';")
    return next()
  })
  server.use("/api/endpoints-template", endpoints);
  server.use("/api/auth", auth);
  server.use("/api/users", users);
  server.use("/api/products", products);
  server.use(error);
};
