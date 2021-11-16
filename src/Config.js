require("dotenv").config();

exports.Database = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_DATABASE || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || "5432",
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN || "0"),
    max: Number(process.env.DB_POOL_MAX || "5"),
  },
  migrations: {
    tableName: "knex_migrations",
  },
  acquireConnectionTimeout: Number(process.env.DB_CONN_TIMEOUT || "2000"),
};

exports.Discord = {
  token: process.env.DISCORD_TOKEN || "",
};
