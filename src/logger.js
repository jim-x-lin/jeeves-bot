const path = require("path");
const pino = require("pino");

// this will be replaced by proper log rotation
const destination = () => {
  const date = new Date();
  const fileName = `${date.getFullYear()}-${date.getMonth() + 1}`;
  const directory = path.resolve(__dirname, "../log");
  return `${directory}/${fileName}.log`;
};

const transport = pino.transport(
  process.env.NODE_ENV === "production"
    ? {
        target: "pino/file",
        level: "info",
        options: { destination: destination(), mkdir: true },
      }
    : {
        target: "pino-pretty",
        level: "debug",
        options: { destination: destination(), mkdir: true },
      }
);

module.exports = {
  logger: pino(transport),
};
