const { DiscordConfig } = require("../config");
const { Client, Intents } = require("discord.js");
const { setUser, getUser, flushDatabase } = require("../users");
const { USER, ECONOMY } = require("../constants");

const populateDatabase = async (members, reset = false) => {
  if (reset) await flushDatabase();
  for (const member of members) {
    const userId = member[0];
    const guildId = member[1].guild.id;
    const user = await getUser(guildId, userId);
    if (!user) {
      await setUser(guildId, userId, {
        [USER.ATTRIBUTES.GUILD_ID]: guildId,
        [USER.ATTRIBUTES.USER_ID]: userId,
        [USER.ATTRIBUTES.NICKNAME]: member[1].nickname,
        [USER.ATTRIBUTES.JOINED_AT]: member[1].joinedTimestamp,
        [USER.ATTRIBUTES.BALANCE]: ECONOMY.NEW_MEMBER_BALANCE,
        [USER.ATTRIBUTES.UPDATED_AT]: Date.now(),
      });
    }
  }
};

const update = async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  await client.login(DiscordConfig.token);

  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = await guild.members.list({ limit: 1000 });
  console.log(`Found ${members.size} members`);
  const reset = process.argv[2] === "--reset";
  if (reset) console.log("Resetting data for all members");

  await populateDatabase(members, reset)
    .then(() => {
      console.log("Successfully populated db");
      client.destroy();
    })
    .catch((err) => console.error("Error populating db: ", err.stack));

  client.destroy();
};

update().then(() => process.exit());
