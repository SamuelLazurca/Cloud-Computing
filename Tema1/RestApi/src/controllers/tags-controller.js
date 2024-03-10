var repository = require('../repositories/tags-repository').TagRepository;
var service = require('../services/tags-service.js').TagsService;
var logger = require("../logger.js");
const log = logger.log;

class TagsController {
    static async getAll(req, res) {
        try{
            let tags = {"tags": await repository.getAll()};
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(tags));
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }

    static async create(req, res) {
        try{
            const new_tag = await service.createNewTag(req);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(new_tag));
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }

    static async getById(id, res)
    {
        try{
            const tag = await service.getById(id);

            if (tag == null) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"message": "Tag with " + id + " not found."}));
            }
            else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(tag));
            }
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
            const tag = await service.delete(id);

            if (tag == null) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"message": "Tag with " + id + " not found."}));
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

    static async update(id, req, res)
    {
        try{
            const tag = await service.updateTag(id, req);

            if (tag == null) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"message": "Tag with " + id + " not found."}));
            }
            else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(tag));
            }
        } catch(error)
        {
            log.error(error.message);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"message": "Internal Error"}));
        }
    }
}

module.exports = {TagsController}