const args = process.argv;

const ARGUMENT = Object.freeze({
  DIR: "--dir",
  DBFILENAME: "--dbfilename",
});

/**
 * @param {string} arg
 * @returns {string | undefined}
 */
function getArgValue(argument) {
  const argIndex = args.findIndex((arg) => arg === argument);
  if (argIndex === -1) return;
  const argValue = args[argIndex + 1];
  return argValue;
}

const config = {
  dir: getArgValue(ARGUMENT.DIR),
  dbfilename: getArgValue(ARGUMENT.DBFILENAME),
};

module.exports = config;
