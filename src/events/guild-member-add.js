const { getUserId, createUser } = require("../users");
const { USER } = require("../constants");

const addGuildMemberToDatabase = async (member) => {
  const userId = await getUserId(member.id);
  if (!userId) {
    await createUser(member.user.id, {
      [USER.ATTRIBUTES.NICKNAME]: member.nickname,
      [USER.ATTRIBUTES.JOINED_AT]: member.joinedTimestamp,
    });
  }
};

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    addGuildMemberToDatabase(member);
  },
};
