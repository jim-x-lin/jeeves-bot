// const connectData = require("../DataProvider");
// const Config = require("./Config");
const { SlashCommandBuilder } = require("@discordjs/builders");

// const foo = async (client) => {
//     const guild = client.guilds.cache.get(Config.Discord.guildId);
//     const members = guild.members.list()

//     const knex = await connectData();
//     const users = await knex("users").select(["discord_id", "initials"])
// }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initials")
    .setDescription("Initials of server members"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
