const { mongoose } = require("mongoose");
const request = require("supertest");
const { Groups } = require("../../../database/models/groups");
const { User } = require("../../../database/models/users");

describe("api/groups", () => {
  let token;
  let name;
  let owner_id;
  let owner_name;

  const apiCall = async () => {
    return await request(server)
      .post("/api/groups/")
      .set("x-auth-token", token)
      .send({
        name,
        owner_id,
        owner_name,
      });
  };
  beforeEach(async () => {
    server = require("../../../server");
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
      const res = await apiCall();

      expect(res.status).toBe(401);
    });

    it("should return a 400 if product is less than 5 characters", async () => {
      name = "12";
      const res = await apiCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '{"error":"\\"name\\" length must be at least 3 characters long"}'
      );
    });

    it("should return a 400 if product is more than 50 characters", async () => {
      name = Array(52).join("x");
      const res = await apiCall();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '{"error":"\\"name\\" length must be less than or equal to 50 characters long"}'
      );
    });

    it("should create a new group if the user and name is valid", async () => {
      const res = await apiCall();

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
      const res = await apiCall();

      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      expect(userOne.groups).toHaveLength(1);
    });
  });

  describe("PUT /join/:id", () => {
    let userOne;
    let userTwo;
    let group_id;

    const apiJoinCall = async () => {
      return await request(server)
        .post(`/api/groups/join/${group_id}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      userOne = await User.findOne({ name: "john" });
      userTwo = await User.findOne({ name: "jane" });
      let res = await apiCall();
      expect(res.status).toBe(200);
      userOne = await User.findOne({ name: "john" });
      group_id = res.body._id;
    });
    
    it("should add a user to the group if given a group id", async () => {
      token = await userTwo.generateAuthToken()
      res = await apiJoinCall();
      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(2);
    });
    
    it("should return an error if the user is already a member", async () => {
      res = await apiJoinCall();
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User is already a member.');
    });
  });
});
