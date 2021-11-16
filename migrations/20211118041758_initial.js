exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("class", 255).notNullable().defaultTo("member");
      table.string("discord_id", 255);
      table.unique("discord_id");
      table.string("initials", 4);
      table.string("nickname", 255);
      table.bigInteger("balance").notNullable().defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable("transactions", (table) => {
      table.increments("id").primary();
      table.integer("credit_user_id").notNullable();
      table.foreign("credit_user_id").references("users.id");
      table.integer("debit_user_id").notNullable();
      table.foreign("debit_user_id").references("users.id");
      table.bigInteger("amount").notNullable();
      table.string("type", 255).notNullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions").dropTable("users");
};
