const { logger } = require("../logger");
const { updateUser } = require("../users");
const { USER } = require("../constants");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    logger.info("Responding to event: guildMemberUpdate");
    updateUser(member.user.id, { [USER.ATTRIBUTES.NICKNAME]: member.nickname });
  },
};
