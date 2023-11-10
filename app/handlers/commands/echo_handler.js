const parseStringToRespSimpleString = require("../../parsers/to_resp/parse_string_to_resp_simple_string");

/**
 * @param {RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function echoHandler(request, connection) {
  const {
    arguments: [message = ""],
  } = request;

  connection.write(parseStringToRespSimpleString(message));
}

module.exports = echoHandler;
