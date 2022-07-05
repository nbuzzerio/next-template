const mongoose = require("mongoose");

module.exports = function (logger) {
  mongoose
    .connect(process.env.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
