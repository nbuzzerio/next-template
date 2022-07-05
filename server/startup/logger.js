const winston = require("winston");
require("winston-mongodb");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.MongoDB({
      db: process.env.db,
      level: "error",
      options: { useUnifiedTopology: true },
    }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
process.on("uncaughtException", (ex) => {
  const { message, stack } = ex;

  logger.error(ex.message, {
    name: "Uncaught exception",
    stack,
    msg: message,
  });
  process.exit(1);
});
process.on("unhandledRejection", async (ex) => {
  const { message, stack } = ex;

  logger.error(ex.message, {
    name: "Unhandled rejection",
    stack,
    msg: message,
  });
  process.exit(1);
});

module.exports = logger;
