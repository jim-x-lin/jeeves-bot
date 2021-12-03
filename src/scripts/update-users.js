const { DiscordConfig } = require("./config");
const { Client, Intents } = require("discord.js");
const { getUserId, createUser, updateUser } = require("../users");

const getInitials = (name) => {
  if (!name) return;
  if (!/^[a-z]+\s+[a-z]+$/i.test(name)) return;
  const [first, last] = name.split(/\s+/);
  return first[0].toUpperCase() + last[0].toUpperCase();
};

const populateDatabase = async (members) => {
  for (const member of members) {
    const userId = await getUserId(member.id);
    if (!userId) await createUser(member);
    await updateUser(member, { initials: getInitials(member.nickname) });
  }
};

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(DiscordConfig.token);

const guild = client.guilds.cache.get(DiscordConfig.guildId);
const members = guild.members.list();
console.log(
  `Found ${members.length} members: `,
  members.map((member) => member.displayName).join("\n")
);

populateDatabase(members)
  .then(() => console.log("Successfully populated db"))
  .catch((err) => console.error("Error populating db: ", err.stack));

client.destroy();
