const { SlashCommandBuilder } = require("@discordjs/builders");
const { getQuote } = require("../quotes/get-quote");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inspire")
    .setDescription("Share an inspirational quote with everyone!"),
  async execute(interaction) {
    const { text, author } = getQuote();
    const inspiration = `“*${text}*”\n        — **${author}**`;
    await interaction.reply({ content: inspiration, ephemeral: false });
  },
};
