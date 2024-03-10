var uuid = require("uuid");
var parse_exception = require("../exceptions/parse-exception").ParseException;

function generateUuid() {
  return uuid.v4();
}

function getRequestBodyData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (body == null || body == undefined || body == "")
          body = JSON.stringify({});
        resolve(body);
      });
    } catch (error) {
      reject(new parse_exception("Error parsing request body"));
    }
  });
}

module.exports = { getRequestBodyData, generateUuid };
