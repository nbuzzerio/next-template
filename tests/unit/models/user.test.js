const { User, validate } = require("../../../database/models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config("./.env");
const mongoose = require("mongoose");

describe("user.generageAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    expect(decoded).toMatchObject(payload);
  });
});