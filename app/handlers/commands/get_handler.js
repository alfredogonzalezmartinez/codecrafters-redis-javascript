const parseStringToRespBulkString = require("../../parsers/to_resp/parse_string_to_resp_bulk_string.js");
const wrongNumberOfArgumentsHandler = require("../errors/wrong_number_of_arguments_handler.js");
const store = require("../../store/store.js");
const { NIL } = require("../../constants.js");

/**
 * @param {RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function getHandler(request, connection) {
  const { arguments = [] } = request;

  if (arguments.length < 1) {
    return wrongNumberOfArgumentsHandler(request, connection);
  }

  const [key] = arguments;
  const value = store.get(key);

  if (!value) return connection.write(NIL);

  connection.write(parseStringToRespBulkString(value));
}

module.exports = getHandler;
