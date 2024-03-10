var repository = require('../repositories/tags-repository').TagRepository;
var tag = require('../entities/tag').Tag;
var uuid = require('../utils').generateUuid;

class TagsService {
    static async createNewTag(command)
    {
        let id = uuid();
        let name = command.name;
        let movies = command.movies;

        if (name == undefined || movies == undefined) {
            throw new Error("Invalid request!");
        }

        let tagObj = new tag({"id": id, "name": name, "movies": movies});

        console.log(tagObj);

        return repository.create(tagObj);
    }

    static async getById(id)
    {
        return repository.getById(id);
    }

    static async delete(id)
    {
        const tag = await repository.getById(id);

        const deleted = await repository.delete(id);

        return tag;
    }

    static async updateTag(id, command)
    {
        let name = command.name;
        let movies = command.movies;

        if (name == undefined || movies == undefined) {
            throw new Error("Invalid request!");
        }

        let tagObj = new tag({"id": id, "name": name, "movies": movies});

        return repository.update(tagObj);
    }
}

module.exports = {TagsService}