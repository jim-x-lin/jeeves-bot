const { logger } = require("../logger");
const { updateUser } = require("../users");
const { USER } = require("../constants");

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(messageReaction, user) {
    const message = messageReaction.message;
    if (!message.inGuild() || !message.channel.isText()) return;
    logger.info("Responding to event: messageReactionAdd");
    const discordId = user.id;
    const channelName = message.channel.name;
    updateUser(discordId, {
      [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
      [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
    });
  },
};
