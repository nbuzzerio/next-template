const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

const { Products, validate } = require("../../database/models/products");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const result = await Products.find({});
    res.send(result);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const products = new Products(req.body);

    try {
      const result = await products.save();
      console.log(result);
      res.send(products);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(400).send(ex.errors[field].message);
      }
    }
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    console.log(req.params.id);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const products = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!products)
      return res
        .status(404)
        .send("The products with the given ID does not exist");

    res.send(products);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const products = await Products.findByIdAndRemove(req.params.id);

    if (!products)
      return res
        .status(404)
        .send("The products with the given ID does not exist");

    res.send(products);
  })
);

module.exports = router;
