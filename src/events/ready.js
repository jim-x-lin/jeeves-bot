module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Client ready, logged in as ${client.user.tag}`);
  },
};
