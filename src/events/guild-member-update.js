const { setUser } = require("../users");
const { USER } = require("../constants");

const updateNickname = async (member) => {
  setUser(member.guild.id, member.user.id, {
    [USER.ATTRIBUTES.NICKNAME]: member.nickname,
  });
};

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  /*eslint-disable no-unused-vars*/
  async execute(oldMember, newMember) {
    /*eslint-enable no-unused-vars*/
    updateNickname(newMember);
  },
};
