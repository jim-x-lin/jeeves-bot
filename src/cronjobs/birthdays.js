const CronJob = require("cron").CronJob;
const { MessageEmbed } = require("discord.js");
const { guildId } = require("../config").DiscordConfig;
const { logger } = require("../logger");
const {
  validBirthdate,
  emojiImageUrl,
  getRandomElement,
} = require("../helpers");

const { getGuildUsers } = require("../users");
const { USER } = require("../constants");

const FALLBACK_IMAGE_URL =
  "https://discord.com/assets/e9e625fd08df5c4b229deae8485b85de.svg";
const MENOS_MEDIUM_CHANNEL_ID = "704538885899681822";
const CRON_TIMEZONE = "America/Los_Angeles";

const wishHappyBirthday = (channel, userId, nickname, imageUrl) => {
  const birthdayMessage =
    `Wish happy birthday to <@${userId}>! ` +
    "Wishing you a great birthday, much happiness on your special day, " +
    "and a memorable year and we all hope you have a marvelous day! " +
    "Hoping your birthday brings you many happy reasons to celebrate! " +
    "May all life's blessings be yours, on your birthday and always. " +
    "The whole squad wishes you the happiest of birthdays and a great year!";

  const birthdayEmbed = new MessageEmbed()
    .setTitle(`Happy Birthday ${nickname}!`)
    .setDescription(birthdayMessage)
    .setImage(imageUrl);

  channel.send({ embeds: [birthdayEmbed] });
};

const chooseBirthdayEmoji = (emojis) => {
  const emojiName = getRandomElement(["old", "jensenkek", "lisasmile"]);
  return emojis.find((emoji) => emoji.name === emojiName);
};

const createBirthdayCronjobs = async (client) => {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(MENOS_MEDIUM_CHANNEL_ID);
  const users = await getGuildUsers(guild.id);
  const emojis = await guild.emojis.fetch();
  const emoji = chooseBirthdayEmoji(emojis);
  const imageUrl = emoji ? emojiImageUrl(emoji.id) : FALLBACK_IMAGE_URL;
  const usersWithBirthdays = users.filter((user) => {
    return validBirthdate(user[USER.ATTRIBUTES.BIRTHDATE]);
  });

  return usersWithBirthdays.map((user) => {
    const birthdate = new Date(user[USER.ATTRIBUTES.BIRTHDATE] + "T12:00:00");
    return new CronJob(
      `0 0 9 ${birthdate.getDate()} ${birthdate.getMonth() + 1} *`,
      () => {
        try {
          wishHappyBirthday(
            channel,
            user[USER.ATTRIBUTES.USER_ID],
            user[USER.ATTRIBUTES.NICKNAME],
            imageUrl
          );
        } catch (err) {
          logger.error(err.stack, "Error wishing happy birthday");
        }
      },
      null,
      false,
      CRON_TIMEZONE
    );
  });
};

module.exports = {
  createBirthdayCronjobs,
};
