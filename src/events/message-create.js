const { updateUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = (message) => {
  if (!message.inGuild() || !message.channel.isText()) return;
  const discordId = message.author.id;
  const channelName = message.channel.name;
  updateUser(discordId, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    updateSighting(message);
  },
};
