const { updateUser } = require("../users");
const { USER } = require("../constants");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    updateUser(member.user.id, { [USER.ATTRIBUTES.NICKNAME]: member.nickname });
  },
};
