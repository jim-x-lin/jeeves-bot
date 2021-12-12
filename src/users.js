const { redisClient } = require("./database");
const { USER } = require("./constants");

(async () => await redisClient.connect())();

// replace falsy vals with empty string
const stringifyValues = (obj) =>
  Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = obj[key] || "";
    return newObj;
  }, {});

const getUser = async (guildId, userId) => {
  return await redisClient.hGetAll(`user:${guildId}::${userId}`);
};

const getAllUsers = async (guildId) => {
  const scan = redisClient.scanIterator({
    TYPE: "string",
    MATCH: `user:${guildId}::*`,
    COUNT: 100,
  });
  let users = [];

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
  for await (const user of scan) {
    // TODO: what is the actual value of `user`?
    console.log(user);
    users.push(user);
  }
  return users;
};

const setUser = async (guildId, userId, attributes = {}) => {
  await redisClient.hSet(`user:${guildId}::${userId}`, {
    ...stringifyValues(attributes),
    [USER.ATTRIBUTES.UPDATED_AT]: Date.now().toString(),
  });
  return await redisClient.hGetAll(`user:${guildId}::${userId}`);
};

module.exports = {
  getUser,
  getAllUsers,
  setUser,
};
