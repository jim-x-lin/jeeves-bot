const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser, updateUser } = require("../users");
const {
  NAME,
  DESCRIPTION,
  SUBCOMMANDS,
  MAP_USER_ATTRIBUTE,
  MAP_SUBCOMMANDS_NAME,
} = require("../constants").COMMANDS.SHARE_ID;

const validId = (idType, gameId) => {
  if (idType === "steam" && /\d{17}/.test(gameId)) return true;
  if (idType === "riot" && /^.+#\w\d+$/.test(gameId)) return true;
  if (idType === "genshin" && /\d{9}/.test(gameId)) return true;
  return false;
};

const saveId = async (discordId, idType, gameId) => {
  if (!validId(idType, gameId)) return;
  const userAttribute = MAP_USER_ATTRIBUTE[idType];
  await updateUser(discordId, { [userAttribute]: gameId });
  const user = await getUser(discordId);
  return user[userAttribute];
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
        .addStringOption((option) =>
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
    const gameId = interaction.options.getString(subcommand.OPTION_NAME);
    const savedId = await saveId(interaction.user.id, idType, gameId);
    const message = savedId
      ? `Successfully shared ${idType} id \`${savedId}\``
      : `Failed to share ${idType} id, \`${gameId}\``;
    await interaction.reply({ content: message, ephemeral: true });
  },
};
