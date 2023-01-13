const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const formatDuration = require("date-fns/formatDuration");
const intervalToDuration = require("date-fns/intervalToDuration");
const { getShortAnswer } = require("../openai");

const MAX_QUESTION_LENGTH = 90;
const MIN_QUESTION_LENGTH = 8;
const LIMIT_MS = 2 * 60 * 1000;

let openaiLastUse = Date.now();

const limitedUsage = (limitMs) => {
  const currentTime = Date.now();
  const waitUntil = openaiLastUse + limitMs;
  if (currentTime < waitUntil) {
    return formatDuration(
      intervalToDuration({ start: 0, end: waitUntil - currentTime }),
      ["minutes", "seconds"]
    );
  }
  openaiLastUse = currentTime;
  return false;
};

const invalidQuestion = (question) => {
  if (
    typeof question !== "string" ||
    question.length < MIN_QUESTION_LENGTH ||
    question.split(/\s+/).length < 3 ||
    !question.endsWith("?")
  )
    return "Your question is not valid.";
  if (question.length > MAX_QUESTION_LENGTH)
    return "Your question is too long.";
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
    const limitReached = !invalid && limitedUsage(LIMIT_MS);
    await interaction.deferReply({ ephemeral: !!(invalid || limitReached) });
    const answer = await getShortAnswer(question);
    if (invalid) {
      interaction.editReply({
        content: `> *${question}*\n${invalid}`,
      });
    } else if (limitReached) {
      interaction.editReply({
        content: `You can ask a question in ${limitReached}.`,
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
