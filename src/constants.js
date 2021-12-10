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

const COMMANDS = Object.freeze({
  SHARE: {
    NAME: "share",
    DESCRIPTION: "Share a game id with server members",
    SUBCOMMANDS: {
      STEAM: {
        NAME: "steam",
        DESCRIPTION: "Share Steam ID",
        OPTION_NAME: "game-id",
        OPTION_DESCRIPTION: "Your Steam ID",
      },
      RIOT: {
        NAME: "riot",
        DESCRIPTION: "Share Riot ID",
        OPTION_NAME: "game-id",
        OPTION_DESCRIPTION: "Your Riot ID",
      },
      GENSHIN: {
        NAME: "genshin",
        DESCRIPTION: "Share Genshin Impact ID",
        OPTION_NAME: "game-id",
        OPTION_DESCRIPTION: "Your Genshin Impact ID",
      },
    },
    MAP_SUBCOMMANDS_NAME: {
      steam: "STEAM",
      riot: "RIOT",
      genshin: "GENSHIN",
    },
    MAP_USER_ATTRIBUTE: {
      steam: USER.ATTRIBUTES.STEAM_ID,
      riot: USER.ATTRIBUTES.RIOT_ID,
      genshin: USER.ATTRIBUTES.GENSHIN_IMPACT_ID,
    },
  },
  VIEW: {
    NAME: "view",
    DESCRIPTION: "View a game id of a server member",
    SUBCOMMANDS: {
      STEAM: {
        NAME: "steam",
        DESCRIPTION: "View Steam ID",
        OPTION_NAME: "member",
        OPTION_DESCRIPTION: "Select a member",
      },
      RIOT: {
        NAME: "riot",
        DESCRIPTION: "View Riot ID",
        OPTION_NAME: "member",
        OPTION_DESCRIPTION: "Select a member",
      },
      GENSHIN: {
        NAME: "genshin",
        DESCRIPTION: "View Genshin Impact ID",
        OPTION_NAME: "member",
        OPTION_DESCRIPTION: "Select a member",
      },
    },
    MAP_SUBCOMMANDS_NAME: {
      steam: "STEAM",
      riot: "RIOT",
      genshin: "GENSHIN",
    },
    MAP_USER_ATTRIBUTE: {
      steam: USER.ATTRIBUTES.STEAM_ID,
      riot: USER.ATTRIBUTES.RIOT_ID,
      genshin: USER.ATTRIBUTES.GENSHIN_IMPACT_ID,
    },
  },
});

module.exports = {
  ECONOMY,
  USER,
  COMMANDS,
};
