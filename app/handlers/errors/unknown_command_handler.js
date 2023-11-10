const { Socket } = require("net");
const parseStringToRespSimpleError = require("../../parsers/to_resp/parse_string_to_resp_simple_error");

/**
 * @param {RedisRequest} request
 * @param {Socket} connection
 */
function unknownCommandHandler(request, connection) {
  const { command } = request;
  const error = `ERROR unknown command '${command}'`;
  connection.write(parseStringToRespSimpleError(error));
}

module.exports = unknownCommandHandler;
