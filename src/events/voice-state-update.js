const { getUser, setUser } = require("../users");
const { USER } = require("../constants");

const updateSighting = async (oldState, newState) => {
  const channel = newState.channel || oldState.channel;
  const channelName = channel ? channel.name : "";
  await setUser(newState.guild.id, newState.member.user.id, {
    [USER.ATTRIBUTES.LAST_SEEN_AT]: Date.now(),
    [USER.ATTRIBUTES.LAST_SEEN_IN]: channelName,
  });
};

const updateVoiceTime = async (oldState, newState) => {
  const user = await getUser(newState.guild.id, newState.member.user.id);
  if (!newState.channel) {
    // user left voice channel
    const lastJoinedVoiceAt = Number(
      user[USER.ATTRIBUTES.LAST_JOINED_VOICE_AT] || ""
    );
    if (lastJoinedVoiceAt === 0) return;
    const timeInChannel = Math.abs(Date.now() - lastJoinedVoiceAt);
    setUser(newState.guild.id, newState.member.user.id, {
      [USER.ATTRIBUTES.VOICE_TIME]:
        timeInChannel + Number(user[USER.ATTRIBUTES.VOICE_TIME] || ""),
      [USER.ATTRIBUTES.LAST_JOINED_VOICE_AT]: "",
    });
  } else if (!oldState.channel) {
    // user joined voice channel
    setUser(newState.guild.id, newState.member.user.id, {
      [USER.ATTRIBUTES.LAST_JOINED_VOICE_AT]: Date.now(),
    });
  }
};

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(oldState, newState) {
    updateSighting(oldState, newState);
    updateVoiceTime(oldState, newState);
  },
};
