const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser } = require("../users");
const SteamID = require("steamid");
const {
  NAME,
  DESCRIPTION,
  SUBCOMMANDS,
  MAP_USER_ATTRIBUTE,
  MAP_SUBCOMMANDS_NAME,
} = require("../constants").COMMANDS.VIEW;

const getId = async (idType, discordId) => {
  const userAttribute = MAP_USER_ATTRIBUTE[idType];
  const user = await getUser(discordId);
  return user[userAttribute];
};

const steamMessage = (steamId, own = false) => {
  let sid = new SteamID(steamId);
  const url = `https://www.dotabuff.com/players/${sid.accountid}`;
  return `You can view ${own ? "your" : "their"} Dota 2 profile here: ${url}`;
};

const riotMessage = (riotId, own = false) => {
  const id = encodeURIComponent(riotId.split("#")[0]);
  const tagline = riotId.split("#")[1];
  const url = `https://app.mobalytics.gg/valorant/profile/${id}/${tagline}/overview`;
  return `You can view ${own ? "your" : "their"} Valorant profile here: ${url}`;
};

const genshinMessage = () => {
  return ""; // `You can view ${own ? 'your' : 'their'} profile here: ${genshinId}`
};

const ownMessage = async (discordId) => {
  let messageArray = [];
  const steamId = await getId(SUBCOMMANDS.STEAM.NAME, discordId);
  if (steamId) {
    messageArray.push(
      `Your steam id is \`${steamId}\`\n${steamMessage(steamId, true)}`
    );
  }
  const riotId = await getId(SUBCOMMANDS.RIOT.NAME, discordId);
  if (riotId) {
    messageArray.push(
      `Your riot id is \`${riotId}\`\n${riotMessage(riotId, true)}`
    );
  }
  const genshinId = await getId(SUBCOMMANDS.GENSHIN.NAME, discordId);
  if (genshinId) {
    messageArray.push(
      `Your genshin id is \`${genshinId}\`\n${genshinMessage(genshinId, true)}`
    );
  }
  if (messageArray.length === 0)
    return "You have not shared any game ids with the server.";
  return messageArray.join("\n\n");
};

const replyMessage = (member, idType, gameId) => {
  if (!gameId) return `${member} has not shared their ${idType} id`;
  const urlMessage = {
    steam: steamMessage,
    riot: riotMessage,
    genshin: genshinMessage,
  }[idType](gameId);
  return `The ${idType} id for ${member} is \`${gameId}\`\n${urlMessage}`;
};

const buildSlashCommand = () => {
  const command = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION);
  Object.values(SUBCOMMANDS).forEach((subc) => {
    command.addSubcommand((subcommand) => {
      if (subc.OPTION_NAME)
        return subcommand
          .setName(subc.NAME)
          .setDescription(subc.DESCRIPTION)
          .addUserOption((option) =>
            option
              .setRequired(true)
              .setName(subc.OPTION_NAME)
              .setDescription(subc.OPTION_DESCRIPTION)
          );
      return subcommand.setName(subc.NAME).setDescription(subc.DESCRIPTION);
    });
  });
  return command;
};

module.exports = {
  data: buildSlashCommand(),
  async execute(interaction) {
    const idType = interaction.options.getSubcommand();
    const subcommand = SUBCOMMANDS[MAP_SUBCOMMANDS_NAME[idType]];
    let message = "";
    if (subcommand.NAME === SUBCOMMANDS.ME.NAME) {
      message = await ownMessage(interaction.user.id);
    } else {
      const member = interaction.options.getMember(subcommand.OPTION_NAME);
      const gameId = await getId(idType, member.user.id);
      message = replyMessage(member, idType, gameId);
    }
    await interaction.reply({
      content: message,
      ephemeral: true,
      suppressEmbeds: true,
    });
  },
};
