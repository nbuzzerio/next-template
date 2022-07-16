const mongoose = require("mongoose");
const request = require("supertest");
const { Products } = require("../../../database/models/products");

let server;

describe("api/products", () => {
  beforeEach(async () => {
    server = require("../../../server");
    await Products.deleteMany({});
  });
  afterEach(async () => {
    server.close();
    await Products.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all products", async () => {
      Products.collection.insertMany([
        { name: "product1", sku: 1999, stock: 10 },
        { name: "product2", sku: 1999, stock: 10 },
      ]);

      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.name === "product1")).toBeTruthy();
      expect(res.body.some((p) => p.name === "product2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a single product if valid id is passed", async () => {
      const product = new Products({ name: "product1", sku: 199, stock: 30 });
      await product.save();

      const res = await request(server).get(`/api/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", product.name);
    });
    
    it("should return 404 if an invalid id is passed", async () => {

      const res = await request(server).get(`/api/products/1`);
      expect(res.status).toBe(404);
    });
  });
});
