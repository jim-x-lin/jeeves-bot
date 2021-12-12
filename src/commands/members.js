const { SlashCommandBuilder } = require("@discordjs/builders");
const { getAllUsers } = require("../users");
const AsciiTable = require("ascii-table");
const { DiscordConfig } = require("../config");
const { MISC, USER } = require("../constants");
const formatDistance = require("date-fns/formatDistance");

const stringToDate = (str) => {
  const ms = Number(str);
  if (!ms || ms === 0) return "";
  const date = new Date(ms);
  return date.toISOString().slice(0, 10);
};

const stringToTimeAgo = (str) => {
  const ms = Number(str);
  if (!ms || ms === 0) return "";
  const date = new Date(ms);
  return formatDistance(date, new Date(), { addSuffix: true });
};

const sortedList = (members, users, sortMethod = "") => {
  const list = [];
  members.forEach((member) => {
    const user = users.filter((user) => user.discord_id === member.id)[0];
    list.push({
      name: member.displayName,
      initials: user ? user[USER.ATTRIBUTES.INITIALS] : "",
      joinDate: user ? stringToDate(user[USER.ATTRIBUTES.JOINED_AT]) : "",
      joinDateSortable: user
        ? Number(user[USER.ATTRIBUTES.JOINED_AT] || "")
        : 0,
      lastSeenAt: user
        ? stringToTimeAgo(user[USER.ATTRIBUTES.LAST_SEEN_AT])
        : "",
      lastSeenAtSortable: user
        ? Number(user[USER.ATTRIBUTES.LAST_SEEN_AT] || "")
        : 0,
      lastSeenIn: user ? user[USER.ATTRIBUTES.LAST_SEEN_IN] : "",
    });
  });
  list.sort((rowA, rowB) => rowA.name.localeCompare(rowB.name, "en"));
  if (sortMethod === "new")
    list.sort((rowA, rowB) => rowB.joinDateSortable - rowA.joinDateSortable);
  if (sortMethod === "sighting")
    list.sort(
      (rowA, rowB) => rowB.lastSeenAtSortable - rowA.lastSeenAtSortable
    );
  return list;
};

const createMembersTable = (list, viewMethod, heading = true) => {
  const table = new AsciiTable().removeBorder();
  if (heading)
    table.setHeading(
      "name",
      ...{
        nickname: ["initials"],
        new: ["join date"],
        sighting: ["last seen", "last seen in"],
      }[viewMethod]
    );
  list.forEach((row) =>
    table.addRow(
      row.name,
      ...{
        nickname: [row.initials],
        new: [row.joinDate],
        sighting: [row.lastSeenAt, row.lastSeenIn],
      }[viewMethod]
    )
  );
  return table;
};

const paginateTable = (tableString) => {
  const lines = tableString.split("\n");
  // solve for n: lineLength * n + additionalCharsPerPage = maxMessageLength
  const linesPerPage = Math.floor(
    (MISC.DISCORD_MESSAGE_MAX_LENGTH - 16) / (lines[0].length + 1)
  );
  const pages = [];
  while (lines.length > 0) {
    pages.push(`\`\`\`\n${lines.splice(0, linesPerPage).join("\n")}\n\`\`\``);
  }
  return pages;
};

const createMembersTableMessages = async (client, viewMethod) => {
  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = await guild.members.list({ limit: 1000 });
  const users = await getAllUsers();
  const list = sortedList(members, users, viewMethod);
  const table = createMembersTable(list, viewMethod);
  const pages = paginateTable(table.toString());
  return pages;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("members")
    .setDescription("List of members")
    .addStringOption((option) =>
      option
        .setName("view")
        .setDescription("Type of member information to view")
        .setRequired(true)
        .addChoices([
          ["by name", "nickname"],
          ["by newly joined", "new"],
          ["by last sighting", "sighting"],
        ])
    ),
  async execute(interaction) {
    const pages = await createMembersTableMessages(
      interaction.client,
      interaction.options.getString("view")
    );
    await interaction.reply({ content: pages.shift(), ephemeral: true });
    while (pages.length > 0) {
      await interaction.followUp({ content: pages.shift(), ephemeral: true });
    }
  },
};
