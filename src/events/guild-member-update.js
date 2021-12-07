const { updateUser } = require("../users");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    updateUser(member.user.id, member.nickname);
  },
};
