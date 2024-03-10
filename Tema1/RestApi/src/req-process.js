var req = require("./request.js");
var logger = require("./logger.js");
var utils = require("./utils.js");
const log = logger.log;
var tagsController = require('./controllers/tags-controller.js').TagsController;
var moviesController = require('./controllers/movies-controller.js').MoviesController;

class RequestProcesser {
  static async process(request, response) {
    try {
      let url = request.url;
      let method = request.method;
      let data = await utils.getRequestBodyData(request);
      let body = JSON.parse(data);
      let match;

      let reqObj = new req.Request(url, method, body);
      log.info(JSON.stringify(reqObj));

      if (reqObj.url == "/tags" && reqObj.method == "GET") {
        tagsController.getAll(request, response);
      }
      else if (reqObj.url == "/tags" && reqObj.method == "POST")
      {
        tagsController.create(reqObj.body, response);
      }
      else if ((match = reqObj.url.match(/\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/)) && reqObj.method == "GET")
      {
        const id = match[1];
        tagsController.getById(id, response);
      }
      else if ((match = reqObj.url.match(/\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/)) && reqObj.method == "DELETE")
      {
        const id = match[1];
        tagsController.delete(id, response);
      }
      else if ((match = reqObj.url.match(/\/tags\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/)) && reqObj.method == "PUT")
      {
        const id = match[1];
        tagsController.update(id, reqObj.body, response);
      }
      else if (reqObj.url == "/movies" && reqObj.method == "POST")
      {
        moviesController.create(reqObj.body, response);
      }
      else if (reqObj.url == "/movies" && reqObj.method == "GET") 
      {
        moviesController.getAll(request, response);
      }
      else if ((match = reqObj.url.match(/\/movies\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/)) && reqObj.method == "DELETE")
      {
        const id = match[1];
        moviesController.delete(id, response);
      }
      else if ((match = reqObj.url.match(/\/movies\/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\b/)) && reqObj.method == "PUT")
      {
        const id = match[1];
        moviesController.update(id, reqObj.body, response);
      }
      else {
        response.writeHeader(404, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({"message": "Route doesn't exist"}));
      }
    } catch (error) {
      log.error(error.message);
      response.writeHeader(500, {'Content-Type': 'application/json'});
      response.end("Internal Server Error");
    }
  }
}

module.exports = { RequestProcesser };
