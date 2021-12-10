const ECONOMY = Object.freeze({
  NEW_MEMBER_BALANCE: 10000,
});

const USER = Object.freeze({
  ATTRIBUTES: {
    DISCORD_ID: "discord_id",
    UPDATED_AT: "updated_at",
    NICKNAME: "nickname",
    INITIALS: "initials",
    BALANCE: "balance",
    JOINED_AT: "joined_at",
    LAST_SEEN_AT: "last_seen_on",
    LAST_SEEN_IN: "last_seen_in",
    STEAM_ID: "steam_id",
    RIOT_ID: "riot_id",
    GENSHIN_IMPACT_ID: "genshin_impact_id",
  },
});

module.exports = {
  ECONOMY,
  USER,
};
