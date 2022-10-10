const { startAllCronjobs } = require("../cronjobs/cron");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Client ready, logged in as ${client.user.tag}`);
    const cronjobs = await startAllCronjobs(client);
    console.log(`Started ${cronjobs.length} cronjobs.`);
  },
};
