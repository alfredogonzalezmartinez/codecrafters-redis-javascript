const { RESP_DATA_TYPE } = require("../../constants");
const { isValidResp } = require("../resp_validations");

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseRespSimpleStringToString(respSimpleString) {
  if (!isValidResp(respSimpleString, RESP_DATA_TYPE.SIMPLE_STRING)) return "";
  return respSimpleString.slice(1, -2);
}

module.exports = parseRespSimpleStringToString;
