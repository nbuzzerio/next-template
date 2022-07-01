const bcrypt = require("bcrypt");
const { User, validate } = require("../../database/models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  console.log("attempt: ", user);
  if (user) return res.status(400).send("User already registered.");

  const { name, email, password } = req.body;

  user = new User({
    name: name,
    email: email,
    password: password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  res.send({ name, email });

  try {
    const result = await user.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
  res.send(result);
});

module.exports = router;
