const { logger } = require("../logger");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { getAllUsers } = require("../users");
const AsciiTable = require("ascii-table");
const { DiscordConfig } = require("../config");
const { USER } = require("../constants");
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
      joinDateSortable: user ? Number(user[USER.ATTRIBUTES.JOINED_AT]) : "",
      lastSeenAt: user
        ? stringToTimeAgo(user[USER.ATTRIBUTES.LAST_SEEN_AT])
        : "",
      lastSeenAtSortable: user
        ? Number(user[USER.ATTRIBUTES.LAST_SEEN_AT])
        : "",
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

const createMembersTable = async (client, viewMethod) => {
  const guild = client.guilds.cache.get(DiscordConfig.guildId);
  const members = await guild.members.list({ limit: 1000 });
  const users = await getAllUsers();
  // only show needed columns, due to character limit
  const table = new AsciiTable().removeBorder().setHeading(
    "name",
    ...{
      nickname: ["initials"],
      new: ["join date"],
      sighting: ["last seen"],
    }[viewMethod]
  );
  sortedList(members, users, viewMethod).forEach((row) => {
    table.addRow(
      row.name,
      ...{
        nickname: [row.initials],
        new: [row.joinDate],
        sighting: [row.lastSeenAt],
      }[viewMethod]
    );
  });
  console.log("table length: ", table.toString().length);
  return `\`\`\`\n${table.toString()}\n\`\`\``;
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
    const table = await createMembersTable(
      interaction.client,
      interaction.options.getString("view")
    );
    interaction
      .reply({ content: table, ephemeral: true })
      .then(() => logger.info("Replied to command: members"))
      .catch((err) => logger.error(err.stack, "Error running command"));
  },
};
