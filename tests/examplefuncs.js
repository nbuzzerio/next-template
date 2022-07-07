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
