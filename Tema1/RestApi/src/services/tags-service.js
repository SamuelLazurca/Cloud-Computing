const { log } = require("../utils/logger");

var repository = require("../repositories/tags-repository").TagRepository;
var tag = require("../entities/tag").Tag;
var uuid = require("../utils/utils").generateUuid;
var invalid_request =
  require("../exceptions/invalid-req-exception").InvalidRequestException;

class TagsService {
  static async createNewTag(command) {
    let id = uuid();
    let name = command.name;
    let movies = command.movies;

    if (name == undefined || movies == undefined) {
      log.error("At createNewTag: Undefined name or movies!");
      throw new invalid_request("Invalid request!");
    }

    let tagObj = new tag({ id: id, name: name, movies: movies });

    return repository.create(tagObj);
  }

  static async getById(id) {
    return repository.getById(id);
  }

  static async delete(id) {
    const tag = await repository.getById(id);

    const deleted = await repository.delete(id);

    return tag;
  }

  static async updateTag(id, command) {
    let name = command.name;
    let movies = command.movies;

    if (name == undefined || movies == undefined) {
      log.error("At updateTag: Undefined name or movies!");
      throw new invalid_request("Invalid request!");
    }

    let tagObj = new tag({ id: id, name: name, movies: movies });

    return repository.update(tagObj);
  }
}

module.exports = { TagsService };
