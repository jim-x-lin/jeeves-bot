const { getUser, setUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = (messageReaction, userId) => {
  const message = messageReaction.message;
  if (!message.inGuild() || !message.channel.isText()) return;
  const channelName = message.channel.name;
  setUser(message.guild.id, userId, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};

const updateMessageReactionCount = async (messageReaction, userId) => {
  const message = messageReaction.message;
  const user = await getUser(message.guild.id, userId);
  setUser(message.guild.id, userId, {
    [USER.ATTRIBUTES.MESSAGE_REACTION_COUNT]:
      user[USER.ATTRIBUTES.MESSAGE_REACTION_COUNT] + 1,
  });
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(messageReaction, user) {
    updateSighting(messageReaction, user.id);
    updateMessageReactionCount(user.id);
  },
};
