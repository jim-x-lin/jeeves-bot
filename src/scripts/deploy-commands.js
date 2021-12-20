// Register commands with Discord

const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("../config").DiscordConfig;

const commands = [];
const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "../commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`${path.resolve(__dirname, "../commands")}/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

const commandRoute =
  process.env.NODE_ENV !== "production" && guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

rest
  .put(commandRoute, { body: commands })
  .then(() => {
    console.log("Successfully registered application commands.");
    process.exit();
  })
  .catch((err) => {
    console.error("Error registering application commands: ", err);
    process.exit();
  });
