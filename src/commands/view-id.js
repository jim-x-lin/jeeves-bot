const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser } = require("../users");
const { USER } = require("../constants");

const getId = async (idType, discordId) => {
  const userAttribute = {
    steam: USER.ATTRIBUTES.STEAM_ID,
    riot: USER.ATTRIBUTES.RIOT_ID,
    genshin: USER.ATTRIBUTES.GENSHIN_IMPACT_ID,
  }[idType];
  return getUser(discordId)[userAttribute];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-id")
    .setDescription("View a game id of a server member")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("steam")
        .setDescription("view Steam ID")
        .addUserOption((option) =>
          option
            .setRequired(true)
            .setName("member")
            .setDescription("Select a member")
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("riot")
        .setDescription("view Riot ID")
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("member")
            .setDescription("Select a member")
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("genshin")
        .setDescription("view Genshin Impact ID")
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("member")
            .setDescription("Select a member")
        )
    ),
  async execute(interaction) {
    const idType = interaction.options.getSubcommand();
    const user = interaction.options.getUser("member");
    const id = await getId(idType, user.id);
    const message = id
      ? `The ${idType} id for ${user.username} is \`${id}\``
      : `${user.username} has not shared their ${idType} id`;
    await interaction.reply({ content: message, ephemeral: true });
  },
};
