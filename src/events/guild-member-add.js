const { getUser, setUser } = require("../users");
const { USER, ECONOMY } = require("../constants");

const addGuildMemberToDatabase = async (member) => {
  const existingUser = await getUser(member.guild.id, member.user.id);
  if (existingUser) {
    const oldNickname = existingUser[USER.ATTRIBUTES.NICKNAME];
    if (oldNickname) member.setNickname(oldNickname);
  } else {
    await setUser(member.guild.id, member.user.id, {
      [USER.ATTRIBUTES.GUILD_ID]: member.guild.id,
      [USER.ATTRIBUTES.USER_ID]: member.user.id,
      [USER.ATTRIBUTES.NICKNAME]: member.nickname,
      [USER.ATTRIBUTES.JOINED_AT]: member.joinedTimestamp,
      [USER.ATTRIBUTES.BALANCE]: ECONOMY.NEW_MEMBER_BALANCE,
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
