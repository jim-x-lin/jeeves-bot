const { createBirthdayCronjobs } = require("./birthdays");
const { logger } = require("../logger");

const startAllCronjobs = async (client) => {
  try {
    const birthdayCronjobs = await createBirthdayCronjobs(client);
    const allCronjobs = [...birthdayCronjobs];
    allCronjobs.forEach((cronjob) => cronjob.start());
    return allCronjobs;
  } catch (err) {
    logger.error(err.stack, "Error creating cronjobs");
  }
};

module.exports = {
  startAllCronjobs,
};
