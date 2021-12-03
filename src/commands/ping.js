const { logger } = require("../logger");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction
      .reply({ content: "Pong!", ephemeral: true })
      .then(() => logger.info("Replied to command ping"))
      .catch((err) => logger.error(err.stack, "Error running command"));
  },
};
