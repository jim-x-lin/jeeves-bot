const { DataConfig } = require("./config");
const { logger } = require("./logger");
const redis = require("redis");

const redisClient = redis.createClient(DataConfig);
redisClient.on("error", (err) => logger.error(err, "Redis Client Error"));

module.exports = {
  redisClient,
};
