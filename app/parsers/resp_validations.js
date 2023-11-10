const { PROTOCOLS_TERMINATOR } = require("../constants");

/**
 * @param {string} string
 * @param {RespDataType} respDataType
 * @returns {boolean}
 */
function isValidResp(string, respDataType) {
  if (typeof string !== "string") return false;

  const startsWithTheRightByte = string.startsWith(respDataType.FIRST_BYTE);
  if (!startsWithTheRightByte) return false;

  const endsWithTheRightProtocolsTerminator =
    string.endsWith(PROTOCOLS_TERMINATOR);
  if (!endsWithTheRightProtocolsTerminator) return false;

  return true;
}

module.exports = { isValidResp };
