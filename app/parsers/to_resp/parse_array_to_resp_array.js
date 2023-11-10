const { RESP_DATA_TYPE, PROTOCOLS_TERMINATOR } = require("../../constants");

/**
 * @param {string[]} array
 * @returns {string}
 */
function parseArrayToRespArray(array) {
  const firstByte = RESP_DATA_TYPE.ARRAY.FIRST_BYTE;
  const length = array.length;
  const elements = array.join("");
  return `${firstByte}${length}${PROTOCOLS_TERMINATOR}${elements}`;
}

module.exports = parseArrayToRespArray;
