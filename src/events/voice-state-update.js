const { updateUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = (oldState, newState) => {
  const discordId = newState.member.user.id;
  const channel = newState.channel || oldState.channel;
  const channelName = channel ? channel.name : "";
  updateUser(discordId, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(oldState, newState) {
    updateSighting(oldState, newState);
  },
};
