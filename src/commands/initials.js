const { logger } = require("../logger");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { getAllUsers } = require("../users");
const AsciiTable = require("ascii-table");
const { DiscordConfig } = require("../config");

const createInitialsTable = async (client) => {
  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = guild.members
    .list()
    .sort((memberA, memberB) =>
      memberA.displayName.localeCompare(memberB.displayName, "en")
    );
  const users = await getAllUsers();
  const table = new AsciiTable("Members").setHeading("name", "initials");
  members.forEach((member) => {
    const user = users.filter((user) => user.discordId === member.id);
    table.addRow(member.displayName, user.initials || "");
  });
  return `\`\`\`${table.toString()}\`\`\``;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initials")
    .setDescription("Initials of server members"),
  async execute(interaction) {
    const table = await createInitialsTable(interaction.client);
    interaction
      .reply({ content: table, ephemeral: true })
      .then(() => logger.info("Replied to command: initials"))
      .catch((err) => logger.error(err.stack, "Error running command"));
  },
};
