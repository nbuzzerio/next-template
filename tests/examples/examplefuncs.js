const db = require("./mockDb");
const text = require("./mockText");

//Testing Numbers
module.exports.absolute = function (num) {
  return num >= 0 ? num : -num;
};

//Testing Strings
module.exports.hello = function (name) {
  return `Hello, ${name}!`;
};

//Testing Arrays
module.exports.getSeasons = function () {
  return ["Summer", "Fall", "Winter", "Spring"];
};

//Testing Objects
module.exports.getUser = function (id) {
  const user = {
    id: 101,
    name: "John",
  };

  if (user.id === id) return user;
};

//Testing Exceptions
module.exports.registerUser = function (username) {
  if (!username) throw new Error("Username is required");

  return { id: new Date().getTime(), username };
};

//Mock functions
module.exports.decrStock = function (item) {
  const product = db.getProductSync(item.itemId);
  if (product.stock > 0) return (product.stock -= 1);
};

//Mock functions - interactions
module.exports.textPatron = function (table) {
  const patron = db.getPatronSync(table.itemId);

  text.send(patron.number, "Your table is ready.");
};
