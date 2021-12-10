const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUser } = require("../users");
const { NAME, DESCRIPTION, SUBCOMMANDS, USER_ATTRIBUTE_MAP } =
  require("../constants").COMMANDS.VIEW_ID;

const getId = async (idType, discordId) => {
  const userAttribute = USER_ATTRIBUTE_MAP[idType];
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
    const user = interaction.options.getUser(SUBCOMMANDS[0].OPTION_NAME);
    const id = await getId(idType, user.id);
    const message = id
      ? `The ${idType} id for ${user.username} is \`${id}\``
      : `${user.username} has not shared their ${idType} id`;
    await interaction.reply({ content: message, ephemeral: true });
  },
};
