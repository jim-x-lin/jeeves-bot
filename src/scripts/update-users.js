const { DiscordConfig } = require("../config");
const { Client, Intents } = require("discord.js");
const { getUserId, createUser, updateUser } = require("../users");

const getInitials = (name) => {
  if (!name) return;
  if (!/^[a-z]+\s+[a-z]+.+$/i.test(name)) return;
  const [first, last] = name.split(/\s+/);
  return first[0].toUpperCase() + last[0].toUpperCase();
};

const populateDatabase = async (members) => {
  for (const member of members) {
    const discordId = member[0];
    const nickname = member[1].nickname;
    const userId = await getUserId(discordId);
    if (!userId) await createUser(discordId, nickname);
    await updateUser(discordId, nickname, { initials: getInitials(nickname) });
  }
};

const update = async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  await client.login(DiscordConfig.token);

  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = await guild.members.list({ limit: 1000 });
  console.log(
    `Found ${members.size} members:\n`,
    members.map((member) => member.displayName).join("\n")
  );

  await populateDatabase(members)
    .then(() => {
      console.log("Successfully populated db");
      client.destroy();
    })
    .catch((err) => console.error("Error populating db: ", err.stack));

  client.destroy();
};

update().then(() => process.exit());
