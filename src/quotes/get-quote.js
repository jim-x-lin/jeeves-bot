const { getRandomElement } = require("../helpers");
const quoteArray = require("./data.json");

const getQuote = () => {
  const quote = getRandomElement(quoteArray);
  return {
    text: quote.text,
    author: quote.from,
  };
};

module.exports = {
  getQuote,
};
