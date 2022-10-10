const { createBirthdayCronjobs } = require("./birthdays");
const { logger } = require("../logger");

const startAllCronjobs = async (client) => {
  try {
    const birthdayCronjobs = await createBirthdayCronjobs(client);
    const allCronjobs = [...birthdayCronjobs(client)];
    allCronjobs.forEach((cronjob) => cronjob.start());
    return allCronjobs;
  } catch (err) {
    logger.error(err.stack, "Error starting cronjobs");
  }
};

module.exports = {
  startAllCronjobs,
};
