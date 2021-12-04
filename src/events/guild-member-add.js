const logger = require("../logger");
const { getUserId, getUser, createUser, updateUser } = require("../users");

const cleanInitials = (str) => {
  const tmp = str.replace(/[^a-zA-Z]/g, "");
  return (tmp[0] + tmp[tmp.length - 1]).toUpperCase();
};

const getInitials = async (member) => {
  const message = await member.send(
    `Welcome to the ${member.guild.name} server!\nTo get started, please provide your initials.`
  );
  const filter = (message) =>
    /[A-Za-z]\.?\s?[A-Za-z]\.?\s?/.test(message.content);

  try {
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const initials = cleanInitials(collected.first().content);
    await updateUser(member.id, { initials: initials });
  } catch (err) {
    logger.info(err, "Error getting initials");
  }
};

const restoreNickname = (member, user) => {
  member.setNickname(user.nickname);
};

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    const userId = await getUserId(member.id);
    if (userId) {
      const user = await getUser(userId);
      restoreNickname(member, user);
    } else {
      await createUser(member);
      await getInitials(member);
    }
  },
};
