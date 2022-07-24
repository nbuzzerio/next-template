const { mongoose } = require("mongoose");
const request = require("supertest");
const {
  Groups,
  algorithm,
  key,
  iv,
} = require("../../../database/models/groups");
const { User } = require("../../../database/models/users");
const crypto = require("crypto");

describe("api/groups", () => {
  console.log(
    "\x1b[32m","\x1b[1m",
    "////////////////////////// TEST START //////////////////////////"
  );
  let token;
  let name;
  let owner_id;
  let owner_name;
  let group_id;
  let timedInvite = false;

  const apiGroupsCall = async () => {
    return await request(server)
      .post("/api/groups/")
      .set("x-auth-token", token)
      .send({
        name,
        owner_id,
        owner_name,
      });
  };

  const apiInviteCall = async (timedInvite) => {
    return await request(server)
      .get(`/api/groups/${timedInvite ? "timed-invite" : "invite"}/${group_id}`)
      .set("x-auth-token", token);
  };

  beforeEach(async () => {
    server = require("../../../server/index.test_server");
    await Groups.collection.deleteMany({});
    await User.collection.deleteMany({});
    await User.collection.insertMany([
      { name: "john", email: "abc@fake.email", password: "12345", groups: [] },
      { name: "jane", email: "dfg@fake.email", password: "12345", groups: [] },
    ]);

    const user = await User.findOne({ name: "john" });
    owner_id = user._id;
    owner_name = user.name;
    token = new User(user).generateAuthToken();
    name = "group1";
  });
  afterEach(async () => {
    server.close();
    await Groups.collection.deleteMany({});
    await User.collection.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 401 if the is not logged in", async () => {
      token = "";
      const res = await apiGroupsCall();

      expect(res.status).toBe(401);
    });

    it("should return a 400 if product is less than 5 characters", async () => {
      name = "12";
      const res = await apiGroupsCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '{"error":"\\"name\\" length must be at least 3 characters long"}'
      );
    });

    it("should return a 400 if product is more than 50 characters", async () => {
      name = Array(52).join("x");
      const res = await apiGroupsCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '{"error":"\\"name\\" length must be less than or equal to 50 characters long"}'
      );
    });

    it("should create a new group if the user and name is valid", async () => {
      const res = await apiGroupsCall();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("owner_id");
      expect(res.body).toHaveProperty("owner_name");
      expect(res.body).toHaveProperty("members");
      expect(res.body.members).toHaveLength(1);
    });

    it("should should add the group to the user", async () => {
      let userOne = await User.findOne({ name: "john" });
      expect(userOne.groups).toHaveLength(0);
      const res = await apiGroupsCall();

      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      expect(userOne.groups).toHaveLength(1);
    });
  });

  describe("PUT /join/:id", () => {
    let userOne;
    let userTwo;
    let inviteKey;
    let timedInvite;

    const apiJoinCall = async () => {
      return await request(server)
        .post(`/api/groups/join/${inviteKey}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      userOne = await User.findOne({ name: "john" });
      userTwo = await User.findOne({ name: "jane" });
      let res = await apiGroupsCall();
      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      group_id = res.body._id;
    });

    it("should add a user to the group if given a permanant invite key", async () => {
      const invite_res = await apiInviteCall(timedInvite);
      inviteKey = invite_res.body.inviteKey;
      token = await userTwo.generateAuthToken();
      res = await apiJoinCall();
      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(2);
    });

    it("should add a user to the group if given an unexpired timed invite key", async () => {
      let timestamp = new Date();
      let expiration = new Date(
        timestamp.setMinutes(timestamp.getMinutes() + 30)
      );

      const text = JSON.stringify({
        id: group_id,
        expiration,
      });
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted =
        cipher.update(text, "utf8", "hex") + cipher.final("hex");

      inviteKey = encrypted;
      token = await userTwo.generateAuthToken();
      res = await apiJoinCall();
      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(2);
    });

    it("should return an error if the user is already a member", async () => {
      const invite_res = await apiInviteCall(timedInvite);
      inviteKey = invite_res.body.inviteKey;
      res = await apiJoinCall();
      expect(res.body.error).toBe("User is already a member.");
      expect(res.status).toBe(400);
    });

    it("should return an error if the token is expired", async () => {
      let timestamp = new Date();
      let expiration = new Date(
        timestamp.setMinutes(timestamp.getMinutes() - 30)
      );

      const text = JSON.stringify({
        id: group_id,
        expiration,
      });
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted =
        cipher.update(text, "utf8", "hex") + cipher.final("hex");

      inviteKey = encrypted;
      token = await userTwo.generateAuthToken();
      res = await apiJoinCall();
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "Invite code has expired."
      );
    });
  });

  describe("GET /invite/:id", () => {
    let userOne;
    let userTwo;

    beforeEach(async () => {
      userOne = await User.findOne({ name: "john" });
      userTwo = await User.findOne({ name: "jane" });
      let res = await apiGroupsCall();
      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      group_id = res.body._id;
    });

    it("should return an error if the user is not a member", async () => {
      res = await apiInviteCall(timedInvite);
      expect(res.status).toBe(200);
      expect(res.body.inviteKey).toHaveLength(160);
    });

    it("should return an error if the user is not a member", async () => {
      token = await userTwo.generateAuthToken();
      res = await apiInviteCall(timedInvite);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "User must be a member to get an invite code."
      );
    });
  });

  describe("GET /timed-invite/:id", () => {
    let userOne;
    let userTwo;

    beforeEach(async () => {
      userOne = await User.findOne({ name: "john" });
      userTwo = await User.findOne({ name: "jane" });
      let res = await apiGroupsCall();
      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      group_id = res.body._id;
    });

    it("should return an error if the user is not a member", async () => {
      const date = new Date();
      const expirationDate = JSON.parse(
        JSON.stringify(new Date(date.setMinutes(date.getMinutes() + 30)))
      );
      timedInvite = true;
      res = await apiInviteCall(timedInvite);

      expect(res.status).toBe(200);
      expect(res.body.inviteKey).toHaveLength(160);

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      const decrypted =
        decipher.update(res.body.inviteKey, "hex", "utf8") +
        decipher.final("utf8");
      const decryptedPayload = JSON.parse(decrypted);

      expect(decryptedPayload.expiration.slice(0, 19)).toBe(
        expirationDate.slice(0, 19)
      );
    });

    it("should return an error if the user is not a member", async () => {
      timedInvite = true;
      token = await userTwo.generateAuthToken();
      res = await apiInviteCall(timedInvite);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "User must be a member to get an invite code."
      );
    });
  });
});
