const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();

const exampleSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 255 },
  lastName: {
    type: String,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v && v.length >= 5 && v.length <= 255;
          callback(result);
        }, 5000);
      },
    }, //custom validator example. Remove isAsync and callback arg for sync
  },
  age: Number,
});

const Example = mongoose.model("example", exampleSchema);

router.get("/", async (req, res) => {
  //Basic regular expressions
  //starts with /^String/
  //ends with /String$/
  //Contains /.*String.*/i (case insensitive)
  const result = await Example.find({
    firstName: "John",
    isGraduated: true,
    age: { $gt: 21, $lte: 100 },
  })
    .skip(1) //pagination starts at 0
    .limit(10)
    .sort({ age: 1 }) //1 is ascending order
    .select({ name: 1, degrees: 1 }) //retrieve only these fields
    .count(); //number of records that match fitler
  console.log(result);
  res.send(result);
});

router.post("/", async (req, res) => {
  const example = new Example(req.body);

  try {
    const result = await example.save();
    console.log(result);
  } catch (exception) {
    for (field in exception.errors) {
      console.log(exception.errors[field].message);
    }
  }
  res.send(example);
});

router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  const { error } = validateExample(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const example = await Example.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!example)
    return res.status(404).send("The example with the given ID does not exist");

  res.send(example);
});

router.delete("/:id", async (req, res) => {
  const example = await Example.findByIdAndRemove(req.params.id);

  if (!example)
    return res.status(404).send("The example with the given ID does not exist");

  res.send(example);
});

router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  const { error } = validateExample(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const example = await Example.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!example)
    return res.status(404).send("The example with the given ID does not exist");

  res.send(example);
});

router.delete("/:id", async (req, res) => {
  const example = await Example.findByIdAndRemove(req.params.id);

  if (!example)
    return res.status(404).send("The example with the given ID does not exist");

  res.send(example);
});

function validateExample(example) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(225).required(),
    lastName: Joi.string().min(2).max(255).required(),
    age: Joi.number(),
  });

  return schema.validate(example);
}

module.exports = router;
