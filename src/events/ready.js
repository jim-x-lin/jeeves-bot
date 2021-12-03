const { logger } = require("../logger");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    logger.info(`Client ready, logged in as ${client.user.tag}`);
  },
};
