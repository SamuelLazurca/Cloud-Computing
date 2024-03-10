var repository = require('../repositories/movies-repository').MoviesRepository;
var service = require('../services/movies-service.js').MoviesService;
var logger = require("../logger.js");
const log = logger.log;

class MoviesController {
    static async create(req, res) {
        try{
            const new_movie = await service.createNewMovie(req);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(new_movie));
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }

    static async getAll(req, res) {
        try{
            let movies = {"movies": await repository.getAll()};
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(movies));
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }

    static async delete(id, res)
    {
        try{
            const movie = await service.delete(id);

            if (movie == null) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"message": "Movie with " + id + " not found."}));
            }
            else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end();
            }
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }

    static async update(id, req, res) {
        try{
            const updated_movie = await service.updateMovie(id, req);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(updated_movie));
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }
}

module.exports = {MoviesController}    