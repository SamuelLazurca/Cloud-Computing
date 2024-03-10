var http = require("http");
var process = require("./req-process");
var requestProcesser = process.RequestProcesser;
var logger = require("./utils/logger.js");
var req = require('./utils/request.js');
const log = logger.log;

var server = http.createServer(function (request, response) {
  requestProcesser.process(request, response);
});

server.listen(3000);

log.info("Server is running on port 3000");
