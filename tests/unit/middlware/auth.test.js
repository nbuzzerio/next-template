const { User } = require("../../../database/models/users");
const auth = require("../../../server/middleware/auth");
require("dotenv").config();
const mongoose = require("mongoose");

describe("auth middlware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
