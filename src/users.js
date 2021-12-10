const { logger } = require("./logger");
const { redisClient } = require("./database");
const { ECONOMY, USER } = require("./constants");

(async () => await redisClient.connect())();

// prevent saving falsy values to redis
const stringifyValues = (obj) =>
  Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = obj[key] || "";
    return newObj;
  }, {});

const getUserId = async (discordId) => {
  return redisClient.hGet("users", discordId);
};

const getUser = async (discordId) => {
  const userId = await redisClient.hGet("users", discordId);
  return redisClient.hGetAll(`user:${userId}`);
};

const getAllUsers = async () => {
  const usersIds = await redisClient.hGetAll("users");
  const users = [];
  for (const userId of Object.values(usersIds)) {
    const user = await redisClient.hGetAll(`user:${userId}`);
    users.push(user);
  }
  return users;
};

const createUser = async (discordId, attributes = {}) => {
  const userId = await redisClient.get("next_user_id");
  if (!userId) redisClient.set("next_user_id", "1");
  await redisClient.hSet("users", discordId, userId);
  await redisClient.hSet(`user:${userId}`, {
    ...stringifyValues(attributes),
    [USER.ATTRIBUTES.DISCORD_ID]: discordId,
    [USER.ATTRIBUTES.BALANCE]: ECONOMY.NEW_MEMBER_BALANCE,
    [USER.ATTRIBUTES.UPDATED_AT]: Date.now().toString(),
  });
  await redisClient.incr("next_user_id");
  return redisClient.hGetAll(`user:${userId}`);
};

const updateUser = async (discordId, attributes = {}) => {
  const userId = await redisClient.hGet("users", discordId);
  if (!userId) {
    logger.error(discordId, "Member not in database");
    return;
  }
  await redisClient.hSet(`user:${userId}`, {
    ...stringifyValues(attributes),
    [USER.ATTRIBUTES.UPDATED_AT]: Date.now().toString(),
  });
  return redisClient.hGetAll(`user:${userId}`);
};

module.exports = {
  getUserId,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
};
