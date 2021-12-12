const { getUser, setUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = (message) => {
  if (!message.inGuild() || !message.channel.isText()) return;
  const channelName = message.channel.name;
  setUser(message.guild.id, message.author.id, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};
const updateMessageCount = async (message) => {
  const user = await getUser(message.guild.id, message.author.id);
  setUser(message.guild.id, user.id, {
    [USER.ATTRIBUTES.MESSAGE_COUNT]: user[USER.ATTRIBUTES.MESSAGE_COUNT] + 1,
  });
};

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    updateSighting(message);
    updateMessageCount(message);
  },
};
