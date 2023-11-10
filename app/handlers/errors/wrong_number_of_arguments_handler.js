const parseStringToRespSimpleError = require("../../parsers/to_resp/parse_string_to_resp_simple_error");

/**
 * @param {RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function wrongNumberOfArgumentsHandler(request, connection) {
  const { command } = request;
  const error = `ERROR wrong number of arguments for '${command}' command`;
  connection.write(parseStringToRespSimpleError(error));
}

module.exports = wrongNumberOfArgumentsHandler;
