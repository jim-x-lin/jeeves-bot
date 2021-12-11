const quoteArray = require("./data.json");

const getQuote = () => {
  const quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
  return {
    text: quote.text,
    author: quote.from,
  };
};

module.exports = {
  getQuote,
};
