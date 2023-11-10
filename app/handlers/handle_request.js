const configHandler = require("./commands/config_handler");
const echoHandler = require("./commands/echo_handler");
const getHandler = require("./commands/get_handler");
const pingHandler = require("./commands/ping_handler");
const setHandler = require("./commands/set_handler");
const unknownCommandHandler = require("./errors/unknown_command_handler");

const COMMAND_HANDLER = Object.freeze({
  PING: pingHandler,
  ECHO: echoHandler,
  SET: setHandler,
  GET: getHandler,
  CONFIG: configHandler,
});

/**
 * @param {import("../types").RedisRequest} request
 * @param {import("node:net").Socket} connection
 */
function handleRequest(request, connection) {
  const { command } = request;
  const handler = COMMAND_HANDLER[command];
  if (!handler) return unknownCommandHandler(request, connection);
  handler(request, connection);
}

module.exports = handleRequest;
