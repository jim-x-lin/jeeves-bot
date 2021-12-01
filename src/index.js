const fs = require("fs");
const Config = require("./Config");
const { Client, Collection, Intents } = require("discord.js");

/**************
 * Initialize *
 **************/

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/************
 * Commands *
 ************/

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

/**********
 * Events *
 **********/

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  try {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  } catch (error) {
    console.error(error.stack);
  }
}

/****************
 * Authenticate *
 ****************/

client.login(Config.Discord.token);
