const parseRespArrayToArray = require("./parse_resp_array_to_array");

/**
 * @param {Buffer} data
 * @returns {RedisRequest}
 */
function parseRequestRespData(data) {
  const respArray = data.toString();
  const [command, ...arguments] = parseRespArrayToArray(respArray);
  return { command: command.toLocaleUpperCase(), arguments };
}

module.exports = parseRequestRespData;
