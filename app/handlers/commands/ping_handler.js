const parseStringToRespSimpleString = require("../../parsers/to_resp/parse_string_to_resp_simple_string");

/**
 * @param {RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function pingHandler(request, connection) {
  const pong = "PONG";
  connection.write(parseStringToRespSimpleString(pong));
}

module.exports = pingHandler;
