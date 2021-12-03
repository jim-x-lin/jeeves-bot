const { getUserId, getUser, createUser, updateUser } = require("../users");

const cleanInitials = (str) => {
  const tmp = str.replace(/[^a-zA-Z]/g, "");
  return (tmp[0] + tmp[tmp.length - 1]).toUpperCase();
};

const saveInitials = async (member) => {
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
  return await updateUser(member.id, { initials: initials });
};

const restoreNickname = (member, user) => {
  member.setNickname(user.nickname);
};

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    const userId = await getUserId(member.id);
    await member.send(
      `Welcome${userId ? " back " : " "}to the ${member.guild.name} server!`
    );
    if (userId) {
      const user = await getUser(userId);
      restoreNickname(member, user);
    } else {
      await createUser(member);
      await saveInitials(member);
    }
  },
};
