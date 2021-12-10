const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser } = require("../users");
const SteamID = require("steamid");
const {
  NAME,
  DESCRIPTION,
  SUBCOMMANDS,
  MAP_USER_ATTRIBUTE,
  MAP_SUBCOMMANDS_NAME,
} = require("../constants").COMMANDS.VIEW_ID;

const getId = async (idType, discordId) => {
  const userAttribute = MAP_USER_ATTRIBUTE[idType];
  const user = await getUser(discordId);
  return user[userAttribute];
};

const steamMessage = (steamId) => {
  let sid = new SteamID(steamId);
  const url = `https://www.dotabuff.com/players/${sid.accountid}`;
  return `You can view their Dota 2 profile here: ${url}`;
};

const riotMessage = (riotId) => {
  const id = encodeURIComponent(riotId.split("#")[0]);
  const tagline = riotId.split("#")[1];
  const url = `https://app.mobalytics.gg/valorant/profile/${id}/${tagline}/overview`;
  return `You can view their Valorant profile here: ${url}`;
};

const genshinMessage = () => {
  return ""; // `You can view their profile here: ${genshinId}`
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
    command.addSubcommand((subcommand) =>
      subcommand
        .setName(subc.NAME)
        .setDescription(subc.DESCRIPTION)
        .addUserOption((option) =>
          option
            .setRequired(true)
            .setName(subc.OPTION_NAME)
            .setDescription(subc.OPTION_DESCRIPTION)
        )
    );
  });
  return command;
};

module.exports = {
  data: buildSlashCommand(),
  async execute(interaction) {
    const idType = interaction.options.getSubcommand();
    const subcommand = SUBCOMMANDS[MAP_SUBCOMMANDS_NAME[idType]];
    const member = interaction.options.getMember(subcommand.OPTION_NAME);
    const gameId = await getId(idType, member.user.id);
    await interaction.reply({
      content: replyMessage(member, idType, gameId),
      ephemeral: true,
      suppressEmbeds: true,
    });
  },
};
