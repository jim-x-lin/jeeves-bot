const connectData = require("../DataProvider");
const { ECONOMY } = require("../Constants");

const cleanInitials = (str) => {
  const tmp = str.replace(/[^a-zA-Z]/g, "");
  return (tmp[0] + tmp[tmp.length - 1]).toUpperCase();
};

const createUser = async (member) => {
  const knex = await connectData();
  return knex("users")
    .returning(["id", "initials", "nickname", "balance"])
    .insert({ discord_id: member.id })
    .onConflict("discord_id")
    .ignore();
};

const saveInitials = async (member, user) => {
  const message = await member.send(
    "To get started, please provide your initials."
  );
  const filter = (message) =>
    /[A-Za-z]\.?\s?[A-Za-z]\.?\s?/.test(message.content);
  const collected = await message.channel
    .awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
    .catch(() => {
      console.log("Didn't receive valid initials within 60 seconds.");
      return;
    });
  const initials = cleanInitials(collected.first().content);
  const knex = await connectData();
  return knex("users").where("id", user.id).update("initials", initials);
};

const restoreNickname = (member, user) => {
  member.setNickname(user.nickname);
};

const createBalance = async (user) => {
  const knex = await connectData();
  return knex("users")
    .where("id", user.id)
    .update("balance", ECONOMY.NEW_MEMBER_BALANCE);
};

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    const user = await createUser(member);
    await member.send(
      `Welcome${user.initials ? " back " : " "}to the ${
        member.guild.name
      } server!`
    );
    // if initials exist, this is a returning member
    if (user.initials) {
      restoreNickname(member, user);
    } else {
      saveInitials(member, user);
      createBalance(member, user);
    }
  },
};
