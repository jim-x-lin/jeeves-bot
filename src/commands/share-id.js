const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser, updateUser } = require("../users");
const { USER } = require("../constants");

const saveId = async (discordId, idType, id) => {
  if (id.length < 6 || id.length > 32) return;
  const userAttribute = {
    steam: USER.ATTRIBUTES.STEAM_ID,
    riot: USER.ATTRIBUTES.RIOT_ID,
    genshin: USER.ATTRIBUTES.GENSHIN_IMPACT_ID,
  }[idType];
  await updateUser(discordId, { [userAttribute]: id });
  return getUser(discordId)[userAttribute];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("share-id")
    .setDescription("Share a game id with server members")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("steam")
        .setDescription("share Steam ID")
        .addStringOption((option) =>
          option.setRequired(true).setName("ID").setDescription("Steam ID")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("riot")
        .setDescription("share Riot ID")
        .addStringOption((option) =>
          option.setRequired(true).setName("ID").setDescription("Riot ID")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("genshin")
        .setDescription("share Genshin Impact ID")
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("ID")
            .setDescription("Genshin Impact ID")
        )
    ),

  async execute(interaction) {
    const idType = interaction.options.getSubcommand();
    const savedId = await saveId(
      interaction.user.id,
      idType,
      interaction.options.getString("ID")
    );
    const message = saveId
      ? `Successfully shared ${idType} id \`${savedId}\``
      : `Failed to share ${idType} id`;
    await interaction.reply({ content: message, ephemeral: true });
  },
};
