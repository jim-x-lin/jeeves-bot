const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");
const { DiscordConfig } = require("./config");
const { Client, Collection, Intents } = require("discord.js");

/**************
 * Initialize *
 **************/

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

/************
 * Commands *
 ************/

client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "./commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`${path.resolve(__dirname, "./commands")}/${file}`);
  try {
    client.commands.set(command.data.name, command);
  } catch (err) {
    logger.error(err.stack, "Error setting Discord command");
  }
}

/**********
 * Events *
 **********/

const eventFiles = fs
  .readdirSync(path.resolve(__dirname, "./events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`${path.resolve(__dirname, "./events")}/${file}`);
  try {
    if (event.once) {
      // cronjobs are initialized in the "ready" event
      client.once(event.name, (...args) => {
        logger.info(`Event detected: ${event.name}`);
        try {
          event.execute(...args);
        } catch (err) {
          logger.error(err.stack, "Error executing event listener");
        }
      });
    } else {
      client.on(event.name, async (...args) => {
        logger.info(`Event detected: ${event.name}`);
        try {
          await event.execute(...args);
        } catch (err) {
          logger.error(err.stack, "Error executing event listener");
        }
      });
    }
  } catch (err) {
    logger.error(err.stack, "Error registering event listeners");
  }
}

/****************
 * Authenticate *
 ****************/

client
  .login(DiscordConfig.token)
  .catch((err) => logger.error(err.stack, "Error logging in Discord client"));
