const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  connection.on("data", (data) => {
    const request = parseRequestData(data);
    handleRequest(request, connection);
  });

  connection.on("close", () => {
    connection.end();
  });
});

server.listen(6379, "127.0.0.1");

const store = new Map();

const PROTOCOLS_TERMINATOR = "\r\n";

const NIL = "$-1\r\n";

const CATEGORY = Object.freeze({
  SIMPLE: "Simple",
  AGGREGATE: "Aggregate",
});

const RESP_DATA_TYPE = Object.freeze({
  SIMPLE_STRING: Object.freeze({
    FIST_BYTE: "+",
    CATEGORY: CATEGORY.SIMPLE,
  }),
  SIMPLE_ERROR: Object.freeze({
    FIST_BYTE: "-",
    CATEGORY: CATEGORY.SIMPLE,
  }),
  INTEGER: Object.freeze({
    FIST_BYTE: ":",
    CATEGORY: CATEGORY.SIMPLE,
  }),
  BULK_STRING: Object.freeze({
    FIST_BYTE: "$",
    CATEGORY: CATEGORY.AGGREGATE,
  }),
  ARRAY: Object.freeze({
    FIST_BYTE: "*",
    CATEGORY: CATEGORY.AGGREGATE,
  }),
});

/**
 * @typedef {Object} RedisRequest
 * @property {string} command
 * @property {string[]} arguments
 */

/**
 * @param {Buffer} data
 * @returns {RedisRequest}
 */
function parseRequestData(data) {
  const respArray = data.toString();
  const [command, ...arguments] = parseRespArrayToArray(respArray);
  return { command: command.toLocaleUpperCase(), arguments };
}

function isValidResp(string, respDataType) {
  const startsWithTheRightByte = string.startsWith(respDataType.FIST_BYTE);
  if (!startsWithTheRightByte) return false;

  const endsWithTheRightProtocolsTerminator =
    string.endsWith(PROTOCOLS_TERMINATOR);
  if (!endsWithTheRightProtocolsTerminator) return false;

  return true;
}

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseRespSimpleStringToString(respSimpleString) {
  if (!isValidResp(respSimpleString, RESP_DATA_TYPE.SIMPLE_STRING)) return "";
  return respSimpleString.slice(1, -2);
}

/**
 * @param {string} respBulkString
 * @returns {string}
 */
function parseRespBulkStringToString(respBulkString) {
  if (!isValidResp(respBulkString, RESP_DATA_TYPE.BULK_STRING)) return "";
  return respBulkString.split(PROTOCOLS_TERMINATOR)[1];
}

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

    if (element.startsWith(RESP_DATA_TYPE.BULK_STRING.FIST_BYTE)) {
      i++;
      const nextElement = arrayElements[i];
      const respBulkString = `${element}${PROTOCOLS_TERMINATOR}${nextElement}${PROTOCOLS_TERMINATOR}`;
      array.push(parseRespBulkStringToString(respBulkString));
    }
  }

  return array;
}

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseStringToRespSimpleString(string) {
  const firstByte = RESP_DATA_TYPE.SIMPLE_STRING.FIST_BYTE;
  return `${firstByte}${string}${PROTOCOLS_TERMINATOR}`;
}

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseStringToRespSimpleError(string) {
  const firstByte = RESP_DATA_TYPE.SIMPLE_ERROR.FIST_BYTE;
  return `${firstByte}${string}${PROTOCOLS_TERMINATOR}`;
}

/**
 * @param {string} respSimpleString
 * @returns {string}
 */
function parseStringToRespBulkString(string) {
  const firstByte = RESP_DATA_TYPE.BULK_STRING.FIST_BYTE;
  const bytesLength = Buffer.byteLength(string);
  return `${firstByte}${bytesLength}${PROTOCOLS_TERMINATOR}${string}${PROTOCOLS_TERMINATOR}`;
}

const COMMAND_HANDLER = Object.freeze({
  PING: pingHandler,
  ECHO: echoHandler,
  SET: setHandler,
  GET: getHandler,
});

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function handleRequest(request, connection) {
  const { command } = request;
  const handler = COMMAND_HANDLER[command];
  if (!handler) return unknownCommandHandler(request, connection);
  handler(request, connection);
}

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function pingHandler(request, connection) {
  const pong = "PONG";
  connection.write(parseStringToRespSimpleString(pong));
}

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function echoHandler(request, connection) {
  const {
    arguments: [message = ""],
  } = request;

  connection.write(parseStringToRespSimpleString(message));
}

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function setHandler(request, connection) {
  const { arguments } = request;

  if (arguments.length < 2) {
    return wrongNumberOfArgumentsHandler(request, connection);
  }

  const [key, value] = arguments;
  store.set(key, value);

  const ok = "OK";
  connection.write(parseStringToRespSimpleString(ok));
}

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
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

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function unknownCommandHandler(request, connection) {
  const { command } = request;
  const error = `ERROR unknown command '${command}'`;
  connection.write(parseStringToRespSimpleError(error));
}

/**
 * @param {RedisRequest} request
 * @param {net.Socket} connection
 */
function wrongNumberOfArgumentsHandler(request, connection) {
  const { command } = request;
  const error = `ERROR wrong number of arguments for '${command}' command`;
  connection.write(parseStringToRespSimpleError(error));
}
