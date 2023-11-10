const { RESP_DATA_TYPE, PROTOCOLS_TERMINATOR } = require("../../constants");
const { isValidResp } = require("../resp_validations");
const parseRespBulkStringToString = require("./parse_resp_bulk_string_to_string");

/**
 * @param {string} respArray
 * @returns {Array}
 */
function parseRespArrayToArray(respArray) {
  if (!isValidResp(respArray, RESP_DATA_TYPE.ARRAY)) return [];

  const [, ...arrayElements] = respArray.split(PROTOCOLS_TERMINATOR);

  const array = [];
  const arrayElementsAmount = arrayElements.length;
  for (let i = 0; i < arrayElementsAmount; i++) {
    const element = arrayElements[i];

    if (element.startsWith(RESP_DATA_TYPE.BULK_STRING.FIRST_BYTE)) {
      i++;
      const nextElement = arrayElements[i];
      const respBulkString = `${element}${PROTOCOLS_TERMINATOR}${nextElement}${PROTOCOLS_TERMINATOR}`;
      array.push(parseRespBulkStringToString(respBulkString));
    }
  }

  return array;
}

module.exports = parseRespArrayToArray;
