const logger = require("../logger");
const { redis } = require("./database");
const { ECONOMY } = require("./constants");

const getUserId = async (discordId) => {
  return redis.hGet("users", discordId);
};

const getUser = async (userId) => {
  return redis.hGetAll(`user:${userId}`);
};

const getAllUsers = async () => {
  const users = await redis.hGetAll("users");
  return Object.values(users).map((userId) => redis.hGetAll(`user:${userId}`));
};

const createUser = async (member) => {
  const userId = await redis.get("next_user_id");
  if (!userId) redis.set("next_user_id", "1");
  await redis.hSet(`user:${userId}`, {
    discord_id: member.id,
    nickname: member.nickname,
    balance: ECONOMY.NEW_MEMBER_BALANCE,
    updated_at: Date.now().toString(),
  });
  await redis.incr("next_user_id");
  return redis.hGetAll(`user:${userId}`);
};

const updateUser = async (member, options = {}) => {
  const userId = await redis.hGet("users", member.id);
  if (!userId) {
    logger.info(member, "Member not in database");
    return;
  }
  if (options.initials) {
    await redis.hSet(`user:${userId}`, { initials: options.initials });
  }
  if (options.balance) {
    await redis.hSet(`user:${userId}`, { balance: options.balance });
  }
  await redis.hSet(`user:${userId}`, {
    nickname: member.nickname,
    updated_at: Date.now().toString(),
  });
  return redis.hGetAll(`user:${userId}`);
};

module.exports = {
  getUserId,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
};
