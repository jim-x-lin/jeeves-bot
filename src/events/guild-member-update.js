const { logger } = require("../logger");
const { updateUser } = require("../users");
const { USER } = require("../constants");
const { getInitials } = require("../helpers");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    logger.info("Responding to event: guildMemberUpdate");
    updateUser(member.user.id, {
      [USER.ATTRIBUTES.NICKNAME]: member.nickname,
      [USER.ATTRIBUTES.INITIALS]: getInitials(member.nickname) || "",
    });
  },
};
