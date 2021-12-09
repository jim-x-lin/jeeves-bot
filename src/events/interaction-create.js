const { logger } = require("../logger");

const respondToCommand = async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error(err.stack, "Error executing command");
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    respondToCommand(interaction);
  },
};
