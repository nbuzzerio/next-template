const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");

const { Groups, validate } = require("../../database/models/groups");
const { User } = require("../../database/models/users");

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    req.body.members = [
      {
        member_id: req.body.owner_id,
        member_name: req.body.owner_name,
        isAdmin: true,
      },
    ];

    const group = new Groups(req.body);

    try {
      const owner = await User.findById({ _id: req.body.owner_id });
      const result = await group.save();
      owner.groups.push({ groupName: result.name, groupId: result._id });
      owner.save();

      res.send(result);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
        res.status(500).send(ex.errors[field].message);
      }
    }
  })
);

module.exports = router;
