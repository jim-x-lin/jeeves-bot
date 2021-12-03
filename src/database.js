const { DataConfig } = require("./config");
const { logger } = require("./logger");
const redis = require("redis");

const connect = async () => {
  const client = redis.createClient(DataConfig);
  client.on("error", (err) => logger.error(err, "Redis Client Error"));
  await client.connect();
  return client;
};

module.exports = {
  redis: connect,
};
