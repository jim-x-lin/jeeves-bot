const { logger } = require("../logger");
const { getUserId, createUser } = require("../users");
const { USER } = require("../constants");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    logger.info("Responding to event: guildMemberAdd");
    const userId = await getUserId(member.id);
    if (!userId) {
      await createUser(member.user.id, {
        [USER.ATTRIBUTES.NICKNAME]: member.nickname,
        [USER.ATTRIBUTES.JOINED_AT]: member.joinedTimestamp,
      });
    }
  },
};
