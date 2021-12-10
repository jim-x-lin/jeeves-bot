const { DiscordConfig } = require("../config");
const { Client, Intents } = require("discord.js");
const { getUserId, createUser, updateUser } = require("../users");
const { USER } = require("../constants");
const { getInitials } = require("../helpers");

const populateDatabase = async (members) => {
  for (const member of members) {
    const discordId = member[0];
    const nickname = member[1].nickname;
    const joinedAt = member[1].joinedTimestamp;
    const userId = await getUserId(discordId);
    if (!userId) await createUser(discordId);
    await updateUser(discordId, {
      [USER.ATTRIBUTES.NICKNAME]: nickname,
      [USER.ATTRIBUTES.INITIALS]: getInitials(nickname),
      [USER.ATTRIBUTES.JOINED_AT]: joinedAt,
    });
  }
};

const update = async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  await client.login(DiscordConfig.token);

  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = await guild.members.list({ limit: 1000 });
  console.log(`Found ${members.size} members`);

  await populateDatabase(members)
    .then(() => {
      console.log("Successfully populated db");
      client.destroy();
    })
    .catch((err) => console.error("Error populating db: ", err.stack));

  client.destroy();
};

update().then(() => process.exit());
