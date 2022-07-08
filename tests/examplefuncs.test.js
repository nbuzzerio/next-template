const examples = require("./examplefuncs");
const db = require("./mockDb");
const text = require("./mockText");

describe("absolute", () => {
  it("should return a positive number if the input is positive", () => {
    const result = examples.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if the input is negative", () => {
    const result = examples.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return 0 if the input is 0", () => {
    const result = examples.absolute(0);
    expect(result).toBe(0);
  });
});

describe("hello", () => {
  it("it should return the hello message", () => {
    const result = examples.hello("John");
    expect(result).toMatch(/John/);
    expect(result).toContain("John");
  });
});

describe("getSeasons", () => {
  it("it should return the seasons", () => {
    const result = examples.getSeasons();
    expect(result).toEqual(
      expect.arrayContaining(["Summer", "Fall", "Winter", "Spring"])
    );
  });
});

describe("getUser", () => {
  it("should return the user with the given id", () => {
    const result = examples.getUser(101);
    //toEqual needs exact same props and values
    expect(result).toEqual({ id: 101, name: "John" });
    //toMatch needs same props and values but not all pairs
    expect(result).toMatchObject({ id: 101, name: "John" });
    //can check each individual prop
    expect(result).toHaveProperty("id", 101);
  });
});

describe("getUser", () => {
  it("should throw if username is falsy", () => {
    const args = [null, undefined, NaN, "", 0, false];
    args.forEach((a) => {
      expect(() => {
        examples.registerUser(a);
      }).toThrow();
    });
  });

  it("should return a user object if a valid username is passed", () => {
    const result = examples.registerUser("John");
    expect(result).toMatchObject({ username: "John" });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe("decrStock", () => {
  it("should decrease stockk by 1 if stock is greater than 0", () => {
    db.getProductSync = function (productId) {
      console.log("Mock reading product...");
      return { id: productId, stock: 10 };
    };

    const item = { itemId: 1, stock: 10 };
    expect(examples.decrStock(item)).toBe(9);
  });
});

describe("textPatron", () => {
  it("should text a patron when the table is ready", () => {
    db.getPatronSync = function () {
      console.log("Reading a patron from MongoDB...");
      return { number: 1234567890 };
    };

    let textSent = false;
    text.send = function (number, message) {
      textSent = true;
    };

    examples.textPatron({ patronId: 1 });
    expect(textSent).toBe(true);
  });
});
//same using jest
// const mockFunc = jest.fn();
// mockFunc.mockReturnValue(1); //sync
// mockFunc.mockResolveValue(1); //promise resolved
// mockFunc.mockRejectValue(new Error('...')); //promise rejected
// const result = await mockFunc();
describe("textPatron", () => {
  it("should text a patron when the table is ready", async () => {
    db.getPatronSync = jest.fn().mockReturnValue({ number: 1234567890 });
    text.send = jest.fn();

    examples.textPatron({ patronId: 1 });

    expect(text.send).toHaveBeenCalled();
    expect(text.send).toHaveBeenCalled();
    expect(text.send.mock.calls[0][0]).toBe(1234567890);
    expect(text.send.mock.calls[0][1]).toMatch(/Your table is ready./);
  });
});
