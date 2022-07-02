const { User } = require("../../database/models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require('bcrypt')

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  res.send(true);
});

function validateUser(req) {
  console.log('req: ', req)
  const schema = Joi.object({
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
