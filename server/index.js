const next = require("next");
const express = require("express");
const endpoints = require("./routes/example");
const auth = require("./routes/auth");
const users = require("./routes/users");
const products = require("./routes/products");
const error = require("./middleware/error");
require("../database/index");
require('dotenv').config()

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require("url");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

if (!process.env.jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1)
}

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use("/api/endpoints-template", endpoints);
  server.use("/api/auth", auth);
  server.use("/api/users", users);
  server.use("/api/products", products);
  server.use(error)

  server.get("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
