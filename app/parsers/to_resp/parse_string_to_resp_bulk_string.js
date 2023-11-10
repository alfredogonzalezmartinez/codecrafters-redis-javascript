const { RESP_DATA_TYPE, PROTOCOLS_TERMINATOR } = require("../../constants");

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseStringToRespBulkString(string) {
  const firstByte = RESP_DATA_TYPE.BULK_STRING.FIRST_BYTE;
  const bytesLength = Buffer.byteLength(string);
  return `${firstByte}${bytesLength}${PROTOCOLS_TERMINATOR}${string}${PROTOCOLS_TERMINATOR}`;
}

module.exports = parseStringToRespBulkString;
