const emojiImageUrl = (emojiId) => {
  return `https://cdn.discordapp.com/emojis/${emojiId}.webp`;
};

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const validBirthdate = (birthdate) => {
  const birthdateRegex = new RegExp(/\d\d\d\d-\d\d-\d\d/);
  return birthdateRegex.test(birthdate);
};

const validUrl = (url) => {
  try {
    new URL(url);
  } catch {
    return false;
  }
  return true;
};

module.exports = {
  emojiImageUrl,
  getRandomElement,
  validBirthdate,
  validUrl,
};
