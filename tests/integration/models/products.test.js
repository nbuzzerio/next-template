const request = require("supertest");
const { Products } = require("../../../database/models/products");

let server;

describe("api/products", () => {
  beforeEach(() => {
    server = require("../../../server");
  });
  afterEach(async () => {
    server.close();
    await Products.remove({})
  });

  describe("GET /", () => {
    it("should return all products", async () => {
      Products.collection.insertMany([
        { name: 'product1', sku: 1999, stock: 10 },
        { name: 'product2', sku: 1999, stock: 10 },
      ]);

      const res = await request(server).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(p => p.name === 'product1')).toBeTruthy();
      expect(res.body.some(p => p.name === 'product2')).toBeTruthy();
    });
  });
});
