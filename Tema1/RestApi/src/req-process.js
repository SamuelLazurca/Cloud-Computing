var req = require("./utils/request.js");
var logger = require("./utils/logger.js");
var utils = require("./utils/utils.js");
const log = logger.log;
var tagsController = require("./controllers/tags-controller.js").TagsController;
var moviesController =
  require("./controllers/movies-controller.js").MoviesController;
var parse_exception = require("./exceptions/parse-exception").ParseException;
require("dotenv").config();

class RequestProcesser {
  static async process(request, response) {
    try {
      const apiKey = request.headers["x-api-key"];

      if (!apiKey || apiKey !== process.env.API_KEY) {
        response.writeHead(401, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Unauthorized" }));
        return;
      }

      let url = request.url;
      let method = request.method;
      let data = await utils.getRequestBodyData(request);
      let reqObj;
      let match;

      try {
        let body = JSON.parse(data);
        reqObj = new req.Request(url, method, body);
        log.info(reqObj.method + " " + reqObj.url);
      } catch (error) {
        throw new parse_exception("Failed to parse request body.");
      }

      if (reqObj.url.match("^/tags/?$") && reqObj.method == "GET") {
        tagsController.getAll(request, response);
      } else if (reqObj.url.match("^/tags/?$") && reqObj.method == "DELETE") {
        response.writeHeader(405, { "Content-Type": "application/json" });
        response.end();
      } else if (reqObj.url.match("^/tags/?$") && reqObj.method == "PUT") {
        response.writeHeader(405, { "Content-Type": "application/json" });
        response.end();
      } else if (reqObj.url.match("^/movies/?$") && reqObj.method == "DELETE") {
        response.writeHeader(405, { "Content-Type": "application/json" });
        response.end();
      } else if (reqObj.url.match("^/movies/?$") && reqObj.method == "PUT") {
        response.writeHeader(405, { "Content-Type": "application/json" });
        response.end();
      } else if (reqObj.url.match("^/tags/?$") && reqObj.method == "POST") {
        tagsController.create(reqObj.body, response);
      } else if (
        (match = reqObj.url.match(
          /\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "GET"
      ) {
        const id = match[1];
        tagsController.getById(id, response);
      } else if (
        (match = reqObj.url.match(
          /\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "DELETE"
      ) {
        const id = match[1];
        tagsController.delete(id, response);
      } else if (
        (match = reqObj.url.match(
          /\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "PUT"
      ) {
        const id = match[1];
        tagsController.update(id, reqObj.body, response);
      } else if (reqObj.url.match("^/movies/?$") && reqObj.method == "POST") {
        moviesController.create(reqObj.body, response);
      } else if (reqObj.url.match("^/movies/?$") && reqObj.method == "GET") {
        moviesController.getAll(request, response);
      } else if (
        (match = reqObj.url.match(
          /\/movies\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "GET"
      ) {
        const id = match[1];
        moviesController.getById(id, response);
      } else if (
        (match = reqObj.url.match(
          /\/movies\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "DELETE"
      ) {
        const id = match[1];
        moviesController.delete(id, response);
      } else if (
        (match = reqObj.url.match(
          /\/movies\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/
        )) &&
        reqObj.method == "PUT"
      ) {
        const id = match[1];
        moviesController.update(id, reqObj.body, response);
      } else {
        response.writeHeader(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Route doesn't exist" }));
      }
    } catch (error) {
      if (error instanceof parse_exception) {
        log.error(error.message);
        response.writeHeader(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: error.message }));
      } else {
        log.error(error.message);
        response.writeHeader(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    }
  }
}

module.exports = { RequestProcesser };
