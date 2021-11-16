const connectData = require("./DataProvider");
const Config = require("./Config");
const { Client, Intents } = require("discord.js");

async function start() {
  const data = await connectData();
  data.raw("SELECT VERSION()").then((result) => console.log(result.rows));

  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  client.once("ready", () => {
    console.log("Ready!");
  });
  client.login(Config.Discord.token);
}

start();
