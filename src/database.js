const { DataConfig } = require("./config");
const redis = require("redis");

const connect = async () => {
  const client = redis.createClient(DataConfig);
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  return client;
};

module.exports = connect;
