var logger = require("../utils/logger.js");
const log = logger.log;
var db = require("../db.js").db;
var movie = require("../entities/movie.js").Movie;
var tag = require("../entities/tag.js").Tag;
var db_exception = require("../exceptions/db-exception.js").DBException;

class MoviesRepository {
  static async create(new_movie) {
    db.run("BEGIN TRANSACTION");

    try {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO movies (id, title, year, director, rating) VALUES (?, ?, ?, ?, ?)",
          [
            new_movie.id,
            new_movie.title,
            new_movie.year,
            new_movie.director,
            new_movie.rating,
          ],
          (error) => {
            if (error) reject(new db_exception(error.message));
            else resolve(this.lastID);
          }
        );
      });

      let tags = [];

      for (const tag_id of new_movie.tags) {
        const tagExists = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM tags WHERE id = ?", [tag_id], (error, rows) => {
            if (error) reject(new db_exception(error.message));
            else if (rows.length == 0) {
              resolve(false);
            } else {
              let _tag = rows.map((row) => new tag(row))[0];
              tags.push(_tag);
              resolve(true);
            }
          });
        });

        if (!tagExists) {
          throw new Error(`Tag with id ${tag_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [new_movie.id, tag_id],
            (error) => {
              if (error) reject(new db_exception(error.message));
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      new_movie.tags = tags;

      return new_movie;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM movies;", [], (error, rows) => {
        if (error) {
          reject(new db_exception(error.message));
        } else {
          const movies = rows.map((row) => new movie(row));
          resolve(movies);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run("PRAGMA foreign_keys=ON;", function (error) {
        if (error) {
          reject(new db_exception(error.message));
          return;
        }

        db.run("DELETE FROM movies WHERE id = ?;", [id], (error) => {
          if (error) {
            reject(new db_exception(error.message));
          } else {
            resolve();
          }
        });
      });
    });
  }

  static async update(updated_movie) {
    db.run("BEGIN TRANSACTION");
    try {
      const movieExists = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM movies WHERE id = ?", [updated_movie.id], (error, rows) => {
          if (error) reject(new db_exception(error.message));
          else if (rows.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!movieExists) {
        db.run("ROLLBACK");
        return null;
      }

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE movies SET title=?, year=?, director=?, rating=? WHERE id=?;",
          [
            updated_movie.title,
            updated_movie.year,
            updated_movie.director,
            updated_movie.rating,
            updated_movie.id,
          ],
          (error) => {
            if (error) {
              reject(new db_exception(error.message));
            } else {
              resolve();
            }
          }
        );
      });

      await new Promise((resolve, reject) => {
        db.run("DELETE FROM movies_tags WHERE movie_id = ?;", [updated_movie.id], (error) => {
          if (error) {
            reject(new db_exception(error.message));
          } else {
            resolve();
          }
        });
      });

      let tags = [];

      for (const tag_id of updated_movie.tags) {
        const tagExists = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM tags WHERE id = ?", [tag_id], (error, rows) => {
            if (error) reject(new db_exception(error.message));
            else if (rows.length == 0) {
              resolve(false);
            } else {
              let _tag = rows.map((row) => new tag(row))[0];
              tags.push(_tag);
              resolve(true);
            }
          });
        });

        if (!tagExists) {
          throw new Error(`Tag with id ${tag_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [updated_movie.id, tag_id],
            (error) => {
              if (error) reject(new db_exception(error.message));
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      updated_movie.tags = tags;

      return updated_movie;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM movies WHERE id = ?;",
        [id],
        async (error, rows) => {
          if (error) {
            reject(new db_exception(error.message));
          } else {
            const movies = rows.map((row) => new movie(row));
            if (movies.length == 0) resolve(null);
            else {
              const movie = movies[0];
              const tags = await new Promise((resolve, reject) => {
                db.all(
                  "SELECT tags.name, movies_tags.tag_id FROM movies_tags INNER JOIN tags ON movies_tags.tag_id = tags.id WHERE movies_tags.movie_id = ?;",
                  [movie.id],
                  (error, rows) => {
                    if (error) reject(new db_exception(error.message));
                    else
                      resolve(
                        rows.map((row) => ({
                          id: row.tag_id,
                          name: row.name,
                        }))
                      );
                  }
                );
              });
              movie.tags = tags;
              resolve(movie);
            }
          }
        }
      );
    });
  }
}

module.exports = { MoviesRepository };
