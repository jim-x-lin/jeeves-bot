const { logger } = require("./logger");
const { redisClient } = require("./database");
const { ECONOMY } = require("./constants");

(async () => await redisClient.connect())();

const getUserId = async (discordId) => {
  return redisClient.hGet("users", discordId);
};

const getUser = async (userId) => {
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

const createUser = async (discordId, nickname) => {
  const userId = await redisClient.get("next_user_id");
  if (!userId) redisClient.set("next_user_id", "1");
  await redisClient.hSet("users", discordId, userId);
  await redisClient.hSet(`user:${userId}`, {
    discord_id: discordId,
    nickname: nickname | "",
    balance: ECONOMY.NEW_MEMBER_BALANCE,
    updated_at: Date.now().toString(),
  });
  await redisClient.incr("next_user_id");
  return redisClient.hGetAll(`user:${userId}`);
};

const updateUser = async (discordId, nickname, options = {}) => {
  const userId = await redisClient.hGet("users", discordId);
  if (!userId) {
    logger.info(discordId, "Member not in database");
    return;
  }
  if (options.initials) {
    await redisClient.hSet(`user:${userId}`, { initials: options.initials });
  }
  if (options.balance) {
    await redisClient.hSet(`user:${userId}`, { balance: options.balance });
  }
  await redisClient.hSet(`user:${userId}`, {
    nickname: nickname || "",
    updated_at: Date.now().toString(),
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
