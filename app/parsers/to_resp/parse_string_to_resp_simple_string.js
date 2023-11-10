const { RESP_DATA_TYPE, PROTOCOLS_TERMINATOR } = require("../../constants");

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseStringToRespSimpleString(string) {
  const firstByte = RESP_DATA_TYPE.SIMPLE_STRING.FIRST_BYTE;
  return `${firstByte}${string}${PROTOCOLS_TERMINATOR}`;
}

module.exports = parseStringToRespSimpleString;
