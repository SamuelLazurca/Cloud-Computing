const { log } = require("../utils/logger");

var repository = require("../repositories/movies-repository").MoviesRepository;
var movie = require("../entities/movie").Movie;
var uuid = require("../utils/utils").generateUuid;
var invalid_request =
  require("../exceptions/invalid-req-exception").InvalidRequestException;

class MoviesService {
  static async getById(id) {
    return repository.getById(id);
  }

  static async createNewMovie(command) {
    let new_uuid = uuid();
    let title = command.title;
    let director = command.director;
    let year = command.year;
    let rating = command.rating;
    let tags = command.tags;

    if (
      title == undefined ||
      director == undefined ||
      year == undefined ||
      rating == undefined ||
      tags == undefined
    ) {
      log.error(
        "At createMovie: Undefined title, director, year, rating or tags!"
      );
      throw new invalid_request("Invalid request!");
    }

    let movieObj = new movie({
      id: new_uuid,
      title: title,
      director: director,
      year: year,
      rating: rating,
      tags: tags,
    });

    return repository.create(movieObj);
  }

  static async delete(id) {
    const movie = await repository.getById(id);

    const deleted = await repository.delete(id);

    return movie;
  }

  static async updateMovie(id, command) {
    let title = command.title;
    let director = command.director;
    let year = command.year;
    let rating = command.rating;
    let tags = command.tags;

    if (
      title == undefined ||
      director == undefined ||
      year == undefined ||
      rating == undefined ||
      tags == undefined
    ) {
      log.error(
        "At updateMovie: Undefined title, director, year, rating or tags!"
      );
      throw new invalid_request("Invalid request!");
    }

    let movieObj = new movie({
      id: id,
      title: title,
      director: director,
      year: year,
      rating: rating,
      tags: tags,
    });

    return repository.update(movieObj);
  }
}

module.exports = { MoviesService };
