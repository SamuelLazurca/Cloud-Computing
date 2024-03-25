var http = require("http");
var process = require("./req-process");
var requestProcesser = process.RequestProcesser;
var logger = require("./utils/logger.js");
var req = require("./utils/request.js");
const log = logger.log;

var server = http.createServer(function (request, response) {
  // Set CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
    return;
  }

  requestProcesser.process(request, response);
});

server.listen(3001);

log.info("Server is running on port 3001");
