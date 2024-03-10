var http = require("http");
var process = require("./req-process");
var requestProcesser = process.RequestProcesser;
var logger = require("./logger.js");
var req = require('./request.js');
const log = logger.log;

var server = http.createServer(function (request, response) {
  process.RequestProcesser.process(request, response);
});

server.listen(3000);

console.log("Server is running on port 3000");
