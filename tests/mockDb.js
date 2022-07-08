module.exports.getProductSync = function (id) {
  console.log("Reading a product from MongoDB...");
  return { id: id, stock: 10 };
};

module.exports.getProduct = async function (id) {
    return new Promise((resolve, reject) => {
        console.log("Reading a product from MongoDB...");
        return { id: id, stock: 10 };
    });
};

module.exports.getPatronSync = function (id) {
  console.log("Reading a patron from MongoDB...");
  return { id: id, name: 'jane', number: 555555555 };
};