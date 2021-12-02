const { DiscordConfig } = require("./config");
const { Client, Intents } = require("discord.js");
const { getUserId, createUser, updateUser } = require("../users");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(DiscordConfig.token);

const guild = client.guilds.cache.get(DiscordConfig.guildId);
const members = guild.members.list();

(async () => {
  for (const member of members) {
    const userId = await getUserId(member.id);
    if (userId) {
      await updateUser(member);
    } else {
      await createUser(member);
    }
  }
})();

client.destroy();
