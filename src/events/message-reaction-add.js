const { updateUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = (messageReaction, user) => {
  const message = messageReaction.message;
  if (!message.inGuild() || !message.channel.isText()) return;
  const discordId = user.id;
  const channelName = message.channel.name;
  updateUser(discordId, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(messageReaction, user) {
    updateSighting(messageReaction, user);
  },
};
