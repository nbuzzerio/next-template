const Joi = require("joi");
const mongoose = require("mongoose");

const groupsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner_name: { type: String, required: true },
  members: [
    {
      member_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      member_name: { type: String, required: true },
      isAdmin: { type: Boolean },
    },
  ],
});

const Groups = mongoose.model("groups", groupsSchema);

function validate(groups) {
  const schema = Joi.object({
    owner_id: Joi.objectId().required(),
    owner_name: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(groups);
}

exports.Groups = Groups;
exports.validate = validate;
