const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser, updateUser } = require("../users");
const { NAME, DESCRIPTION, SUBCOMMANDS, USER_ATTRIBUTE_MAP } =
  require("../constants").COMMANDS.SHARE_ID;

const saveId = async (discordId, idType, id) => {
  if (id.length < 6 || id.length > 32) return;
  const userAttribute = USER_ATTRIBUTE_MAP[idType];
  await updateUser(discordId, { [userAttribute]: id });
  return getUser(discordId)[userAttribute];
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
    const id = interaction.options.getString(SUBCOMMANDS[0].OPTION_NAME);
    const savedId = await saveId(interaction.user.id, idType, id);
    const message = saveId
      ? `Successfully shared ${idType} id \`${savedId}\``
      : `Failed to share ${idType} id`;
    await interaction.reply({ content: message, ephemeral: true });
  },
};
