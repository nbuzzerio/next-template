const examples = require("./examplefuncs");

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
