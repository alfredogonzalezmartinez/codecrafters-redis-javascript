const config = require("../../config.js");
const parseArrayToRespArray = require("../../parsers/to_resp/parse_array_to_resp_array.js");
const parseStringToRespBulkString = require("../../parsers/to_resp/parse_string_to_resp_bulk_string.js");
const unknownCommandHandler = require("../errors/unknown_command_handler.js");

const CONFIG_HANDLER = Object.freeze({
  GET: configGetHandler,
});

/**
 * @param {import("../../types.js").RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function configHandler(request, connection) {
  const [option] = request.arguments;
  console.log({ option });
  const handler = CONFIG_HANDLER[option.toLocaleUpperCase()];
  if (!handler) return unknownCommandHandler(request, connection);
  handler(request, connection);
}

/**
 * @param {import("../../types.js").RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function configGetHandler(request, connection) {
  const [, ...options] = request.arguments;

  const values = options.map((option) => {
    const value = config[option];

    if (value === undefined) return;

    return [
      parseStringToRespBulkString(option),
      parseStringToRespBulkString(value),
    ];
  });

  connection.write(parseArrayToRespArray(values.flat()));
}

module.exports = configHandler;
