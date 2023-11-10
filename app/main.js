const net = require("node:net");
const parseRequestRespData = require("./parsers/from_resp/parse_request_resp_data.js");
const handleRequest = require("./handlers/handle_request.js");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  connection.on("data", (data) => {
    const request = parseRequestRespData(data);
    handleRequest(request, connection);
  });

  connection.on("close", () => {
    connection.end();
  });
});

server.listen(6379, "127.0.0.1");
