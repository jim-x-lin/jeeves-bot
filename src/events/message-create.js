const { logger } = require("../logger");
const { updateUser } = require("../users");
const { USER } = require("../constants");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.inGuild() || !message.channel.isText()) return;
    logger.info("Responding to event: messageCreate");
    const discordId = message.author.id;
    const channelName = message.channel.name;
    updateUser(discordId, {
      [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
      [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
    });
  },
};
