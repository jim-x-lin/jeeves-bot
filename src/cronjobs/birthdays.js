// TODO WIP
const CronJob = require("cron").CronJob;
const { MessageEmbed } = require("discord.js");
const { guildId } = require("../config").DiscordConfig;

const { getGuildUsers } = require("../users");
const { USER } = require("../constants");

const MENOS_MEDIUM_CHANNEL_ID = "704538885899681822";
const BIRTHDAY_IMAGE =
  "https://pbfcomics.com/wp-content/uploads/2004/03/PBF-Todays-My-Birthday.png";
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
    .setImage(imageUrl || BIRTHDAY_IMAGE); // TODO WIP
  channel.send({ embeds: [birthdayEmbed] });
};

const createBirthdayCronjobs = async (client) => {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(MENOS_MEDIUM_CHANNEL_ID);
  const users = await getGuildUsers(guild.id);
  const birthdateRegex = new RegExp(/\d\d\d\d-\d\d-\d\d/);
  const usersWithBirthdays = users.filter((user) => {
    birthdateRegex.test(user[USER.ATTRIBUTES.BIRTHDATE]);
  });
  return usersWithBirthdays.map((user) => {
    const birthdate = new Date(user[USER.ATTRIBUTES.BIRTHDATE]);
    return new CronJob(
      `0 0 9 ${birthdate.getDate()} ${birthdate.Month() + 1} *`,
      () =>
        wishHappyBirthday(
          channel,
          user[USER.ATTRIBUTES.USER_ID],
          user[USER.ATTRIBUTES.NICKNAME],
          user[USER.ATTRIBUTES.BIRTHDAY_IMAGE_URL]
        ),
      null,
      false,
      CRON_TIMEZONE
    );
  });
};

// post every minute
const createTestCronjobs = async (client) => {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(MENOS_MEDIUM_CHANNEL_ID);
  return [
    new CronJob(
      `*/10 * * * * *`,
      () => wishHappyBirthday(channel, "595443461734268928", "Jamal Lamar"),
      null,
      false,
      CRON_TIMEZONE
    ),
  ];
};

module.exports = {
  createBirthdayCronjobs,
  createTestCronjobs,
};
