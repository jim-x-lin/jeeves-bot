const pino = require("pino");

// this will be replaced by proper log rotation
const destination = () => {
  const date = Date.now();
  const fileName = `${date.getFullYear()}-${date.getMonth() + 1}`;
  return `../logs/${fileName}.log`;
};

const transport = pino.transport(
  process.env.NODE_ENV === "production"
    ? {
        target: "pino/file",
        level: "info",
        options: { destination: destination() },
      }
    : {
        target: "pino-pretty",
        level: "debug",
        options: { destination: destination() },
      }
);

module.exports = {
  logger: pino(transport),
};
