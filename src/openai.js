const { Configuration, OpenAIApi } = require("openai");
const { OpenaiConfig } = require("./config");
const { logger } = require("./logger");

const configuration = new Configuration({
  apiKey: OpenaiConfig.apiKey,
});

const openai = new OpenAIApi(configuration);

const getShortAnswer = async (question) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
      max_tokens: 64,
    });
    return completion.data.choices[0].text.trim();
  } catch (err) {
    if (err.response) {
      logger.error(err.response, "Openai error");
    } else {
      logger.error(err.message, "Openai error");
    }
  }
};

module.exports = {
  getShortAnswer,
};
