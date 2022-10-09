// TODO WIP
// const { createBirthdayCronjobs } = require("./birthdays")
const { createTestCronjobs } = require("./birthdays");

const startAllCronjobs = async (client) => {
  try {
    // const birthdayCronjobs = await createBirthdayCronjobs(client)
    // const allCronjobs = [...birthdayCronjobs(client)];
    const testcronjobs = await createTestCronjobs(client);
    const allCronjobs = [...testcronjobs];
    allCronjobs.forEach((cronjob) => cronjob.start());
    return allCronjobs;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  startAllCronjobs,
};
