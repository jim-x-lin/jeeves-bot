const connectData = require("../DataProvider");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(member) {
    const knex = await connectData();
    knex("users")
      .where("discord_id", member.id)
      .update("nickname", member.nickname);
  },
};
