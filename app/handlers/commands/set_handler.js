const { EXPIRY_OPTION } = require("../../constants.js");
const parseRespBulkStringToString = require("../../parsers/from_resp/parse_resp_bulk_string_to_string.js");
const wrongNumberOfArgumentsHandler = require("../errors/wrong_number_of_arguments_handler.js");
const store = require("../../store/store.js");
const parseStringToRespSimpleString = require("../../parsers/to_resp/parse_string_to_resp_simple_string.js");

/**
 * @param {RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function setHandler(request, connection) {
  const { arguments } = request;

  if (arguments.length < 2) {
    return wrongNumberOfArgumentsHandler(request, connection);
  }

  const [key, value, ...options] = arguments;
  const expiry = getExpiry(options);
  store.set(key, value, { expiry });

  const ok = "OK";
  connection.write(parseStringToRespSimpleString(ok));
}

/**
 * @param {string[]} options
 * @returns {number|null}
 */
function getExpiry(options) {
  const expiryOption = options.find((option) =>
    Object.values(EXPIRY_OPTION)
      .map(({ option }) => option)
      .includes(option.toLocaleUpperCase())
  );

  if (!expiryOption) return null;

  const expiryOptionIndex = options.indexOf(expiryOption);
  const expiryOptionValue = Number.parseInt(options[expiryOptionIndex + 1]);

  const isValidValue = !isNaN(expiryOptionValue) && expiryOptionValue > 0;
  if (!isValidValue) return null;

  const option = expiryOption.toLocaleUpperCase();
  const { millisecondsMultiplier } = EXPIRY_OPTION[option];

  return expiryOptionValue * millisecondsMultiplier;
}

module.exports = setHandler;
