var repository = require("../repositories/movies-repository").MoviesRepository;
var service = require("../services/movies-service.js").MoviesService;
var logger = require("../utils/logger.js");
const log = logger.log;
var db_exception = require("../exceptions/db-exception.js").DBException;
var invalid_request =
  require("../exceptions/invalid-req-exception").InvalidRequestException;

class MoviesController {
  static async create(req, res) {
    try {
      const new_movie = await service.createNewMovie(req);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(new_movie));
    } catch (error) {
      if (error instanceof invalid_request) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid request" }));
      } else if (error instanceof db_exception) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Internal Server Error: DbException" })
        );
      } else {
        log.error(error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Error" }));
      }
    }
  }

  static async getById(id, res) {
    try {
      const movie = await service.getById(id);

      if (movie == null) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Movie with " + id + " not found." })
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(movie));
      }
    } catch (error) {
      if (error instanceof db_exception) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Internal Server Error: DbException" })
        );
      } else {
        log.error(error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    }
  }

  static async getAll(req, res) {
    try {
      let movies = { movies: await repository.getAll() };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(movies));
    } catch (error) {
      if (error instanceof db_exception) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Internal Server Error: DbException" })
        );
      } else {
        log.error(error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    }
  }

  static async delete(id, res) {
    try {
      const movie = await service.delete(id);

      if (movie == null) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Movie with " + id + " not found." })
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end();
      }
    } catch (error) {
      if (error instanceof db_exception) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Internal Server Error: DbException" })
        );
      } else {
        log.error(error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Error" }));
      }
    }
  }

  static async update(id, req, res) {
    try {
      const updated_movie = await service.updateMovie(id, req);

      if (updated_movie == null) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Movie with " + id + " not found." })
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updated_movie));
      }
    } catch (error) {
      if (error instanceof invalid_request) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid request" }));
      } else if (error instanceof db_exception) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Internal Server Error: DbException" })
        );
      } else {
        log.error(error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    }
  }
}

module.exports = { MoviesController };
