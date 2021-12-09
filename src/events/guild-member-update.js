const { updateUser } = require("../users");
const { USER } = require("../constants");
const { getInitials } = require("../helpers");

const updateGuildMemberInDatabase = async (member) => {
  updateUser(member.user.id, {
    [USER.ATTRIBUTES.NICKNAME]: member.nickname,
    [USER.ATTRIBUTES.INITIALS]: getInitials(member.nickname) || "",
  });
};

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    updateGuildMemberInDatabase(member);
  },
};
