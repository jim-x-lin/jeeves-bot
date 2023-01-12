const { YahooConfig } = require("../config");
const axios = require("axios");
const { parse } = require("node-html-parser");
const YahooFantasy = require("yahoo-fantasy");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const getNbaPlayerId = async (playerName) => {
  const queryUrl = `https://basketball.fantasysports.yahoo.com/nba/2288/playersearch?&search=${encodeURIComponent(
    playerName
  )}`;
  // https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36";
  const response = await axios.get(queryUrl, {
    headers: { "User-Agent": userAgent },
  });
  const playerEl = parse(response.data).querySelector(".ysf-player-name > a");
  if (!playerEl) return;
  return playerEl.getAttribute("href").match(/players\/(\d+)$/)[1];
};

const labeledStats = (statNames, statVals) => {
  let stats = [];
  statVals.forEach((statVal) => {
    const statName = statNames.filter(
      (statName) => Number(statName.stat_id) === Number(statVal.stat_id)
    );
    if (statName.length > 0 && statName[0].name === "Games Started") return;
    if (statName.length > 0) {
      stats.push({
        name: statName[0].name,
        value: statVal.value,
      });
    }
  });
  return stats;
};

const getNbaPlayer = async (playerName) => {
  const playerId = await getNbaPlayerId(playerName);
  if (!playerId) return;
  const playerKey = `nba.p.${playerId}`;
  const yf = new YahooFantasy(YahooConfig.appKey, YahooConfig.appSecret);
  const player = await yf.player.stats(playerKey);
  const stat_categories = await yf.game.stat_categories("nba");
  return {
    name: player.name.full,
    team: player.editorial_team_full_name,
    headshot: player.headshot.url.match(/\/(http.+)$/)[1],
    number: player.uniform_number,
    position: player.display_position,
    stats: labeledStats(stat_categories.stat_categories, player.stats.stats),
  };
};

const playerEmbed = (player) => {
  const embed = new MessageEmbed()
    .setTitle(player.name)
    .addFields(
      { name: "Team", value: player.team, inline: true },
      { name: "Position", value: player.position, inline: true },
      { name: "Number", value: player.number, inline: true },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage(player.headshot)
    .setTimestamp();

  player.stats.forEach((stat) => {
    embed.addField(stat.name, stat.value, false);
  });

  return embed;
};

const buildSlashCommand = () => {
  const command = new SlashCommandBuilder()
    .setName("nba")
    .setDescription("View NBA player stats")
    .addStringOption((option) =>
      option.setName("player").setDescription("Player name").setRequired(true)
    );
  return command;
};

module.exports = {
  data: buildSlashCommand(),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const playerName = interaction.options.getString("player");
    const player = await getNbaPlayer(playerName);
    if (player) {
      interaction.editReply({
        embeds: [playerEmbed(player)],
      });
    } else {
      interaction.editReply({
        content: `Could not find a player named ${playerName}`,
        ephemeral: true,
      });
    }
  },
};
