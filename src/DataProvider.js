const Config = require("./Config");

const connect = async () => {
  const knex = require("knex")(Config.Database);

  // Verify the connection before proceeding
  try {
    await knex.raw("SELECT now()");
    return knex;
  } catch (error) {
    throw new Error(
      "Unable to connect to Postgres via Knex. Ensure a valid connection."
    );
  }
};

module.exports = connect;
