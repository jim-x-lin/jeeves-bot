const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getShortAnswer } = require("../openai");

const invalidQuestion = (question) => {
  if (
    typeof question !== "string" ||
    question.length < 3 ||
    !question.endsWith("?")
  )
    return "Your question is not valid.";
  if (question.length > 80) return "Your question is too long.";
  return false;
};

const answerEmbed = (question, answer) => {
  return new MessageEmbed().setTitle(question).setDescription(answer);
};

const buildSlashCommand = () => {
  const command = new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question")
    .addStringOption((option) =>
      option.setName("question").setDescription("Question").setRequired(true)
    );
  return command;
};

module.exports = {
  data: buildSlashCommand(),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const invalid = invalidQuestion(question);
    await interaction.deferReply({ ephemeral: !!invalid });
    const answer = await getShortAnswer(question);
    if (invalid) {
      interaction.editReply({
        content: `> *${question}*\n${invalid}`,
      });
    } else if (answer) {
      interaction.editReply({
        embeds: [answerEmbed(question, answer)],
      });
    } else {
      interaction.editReply({
        content: "Something went wrong, try again later.",
      });
    }
  },
};
