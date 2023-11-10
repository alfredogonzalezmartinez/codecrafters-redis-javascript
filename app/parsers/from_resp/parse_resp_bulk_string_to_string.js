const { RESP_DATA_TYPE, PROTOCOLS_TERMINATOR } = require("../../constants");
const { isValidResp } = require("../resp_validations");

/**
 * @param {string} respBulkString
 * @returns {string}
 */
function parseRespBulkStringToString(respBulkString) {
  if (!isValidResp(respBulkString, RESP_DATA_TYPE.BULK_STRING)) return "";
  return respBulkString.split(PROTOCOLS_TERMINATOR)[1];
}

module.exports = parseRespBulkStringToString;
