const fs = require("fs");
const { logger } = require("./logger");
const { DiscordConfig } = require("./config");
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
  client.commands
    .set(command.data.name, command)
    .catch((err) => logger.error(err.stack, "Error setting Discord command"));
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
      client.once(event.name, (...args) =>
        event
          .execute(...args)
          .catch((err) => logger.error(err.stack, "Error responding to event"))
      );
    } else {
      client.on(event.name, (...args) =>
        event
          .execute(...args)
          .catch((err) => logger.error(err.stack, "Error responding to event"))
      );
    }
  } catch (err) {
    logger.error(err.stack, "Error registering Discord events");
  }
}

/****************
 * Authenticate *
 ****************/

client
  .login(DiscordConfig.token)
  .catch((err) => logger.error(err.stack, "Error logging in Discord client"));
