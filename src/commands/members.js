const { SlashCommandBuilder } = require("@discordjs/builders");
const { getGuildUsers } = require("../users");
const AsciiTable = require("ascii-table");
const { MISC, USER } = require("../constants");
const formatDistanceToNow = require("date-fns/formatDistanceToNow");
const formatDuration = require("date-fns/formatDuration");
const intervalToDuration = require("date-fns/intervalToDuration");

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
  return formatDistanceToNow(date, { addSuffix: true });
};

const stringToDuration = (str) => {
  const ms = Number(str);
  if (!ms || ms === 0) return "";
  const duration = intervalToDuration({ start: 0, end: ms });
  return formatDuration(duration, ["days", "hours"]);
};

const sortedList = (members, users, sortMethod = "") => {
  const list = [];
  members.forEach((member) => {
    if (member.user.bot) return;
    const user = users.filter(
      (user) => user[USER.ATTRIBUTES.USER_ID] === member.user.id
    )[0];
    if (!user) return;
    list.push({
      name: member.displayName,
      joinDate: stringToDate(user[USER.ATTRIBUTES.JOINED_AT]) || "",
      joinDateSortable: Number(user[USER.ATTRIBUTES.JOINED_AT] || ""),
      lastSeenAt: stringToTimeAgo(user[USER.ATTRIBUTES.LAST_SEEN_AT]),
      lastSeenAtSortable: Number(user[USER.ATTRIBUTES.LAST_SEEN_AT] || ""),
      lastSeenIn: user[USER.ATTRIBUTES.LAST_SEEN_IN] || "",
      voiceTime: stringToDuration(user[USER.ATTRIBUTES.VOICE_TIME]) || "",
      voiceTimeSortable: Number(user[USER.ATTRIBUTES.VOICE_TIME] || ""),
      messageCount: Number(user[USER.ATTRIBUTES.MESSAGE_COUNT] || ""),
      reactionCount: Number(user[USER.ATTRIBUTES.MESSAGE_REACTION_COUNT] || ""),
    });
  });
  switch (sortMethod) {
    case "new":
      list.sort((rowA, rowB) => rowB.joinDateSortable - rowA.joinDateSortable);
      break;
    case "sighting":
      list.sort(
        (rowA, rowB) => rowB.lastSeenAtSortable - rowA.lastSeenAtSortable
      );
      break;
    case "voice":
      list.sort(
        (rowA, rowB) => rowB.voiceTimeSortable - rowA.voiceTimeSortable
      );
      break;
    case "message":
      list.sort((rowA, rowB) => rowB.messageCount - rowA.messageCount);
      break;
    case "reaction":
      list.sort((rowA, rowB) => rowB.reactionCount - rowA.reactionCount);
      break;
    default:
      list.sort((rowA, rowB) => rowA.name.localeCompare(rowB.name, "en"));
  }
  return list;
};

const createMembersTable = (list, viewMethod, heading = true) => {
  const table = new AsciiTable().removeBorder();
  if (heading)
    table.setHeading(
      "name",
      ...{
        name: [],
        new: ["join date"],
        sighting: ["last seen", "last seen in"],
        voice: ["time in voice channels"],
        message: ["messages"],
        reaction: ["reactions"],
      }[viewMethod]
    );
  list.forEach((row) =>
    table.addRow(
      row.name,
      ...{
        name: [],
        new: [row.joinDate],
        sighting: [row.lastSeenAt, row.lastSeenIn],
        voice: [row.voiceTime],
        message: [row.messageCount],
        reaction: [row.reactionCount],
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

const createMembersTableMessages = async (guild, viewMethod) => {
  const members = await guild.members.list({ limit: 1000 });
  const users = await getGuildUsers(guild.id);
  const list = sortedList(members, users, viewMethod);
  const table = createMembersTable(list, viewMethod);
  const pages = paginateTable(table.toString());
  return pages;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("members")
    .setDescription("View members")
    .addStringOption((option) =>
      option
        .setName("by")
        .setDescription("Type of member information")
        .setRequired(true)
        .addChoices([
          ["name", "name"],
          ["newly joined", "new"],
          ["last sighting", "sighting"],
          ["voice channel time", "voice"],
          ["messages", "message"],
          ["reactions", "reaction"],
        ])
    ),
  async execute(interaction) {
    const pages = await createMembersTableMessages(
      interaction.guild,
      interaction.options.getString("by")
    );
    await interaction.reply({ content: pages.shift(), ephemeral: true });
    while (pages.length > 0) {
      await interaction.followUp({ content: pages.shift(), ephemeral: true });
    }
  },
};
