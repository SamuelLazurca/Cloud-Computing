var logger = require("../utils/logger.js");
const log = logger.log;
var db = require("../db.js").db;
var tag = require("../entities/tag.js").Tag;
var movie = require("../entities/movie.js").Movie;
var db_exception = require("../exceptions/db-exception.js").DBException;

class TagRepository {
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tags;", [], (error, rows) => {
        if (error) {
          reject(new db_exception(error.message));
        } else {
          const tags = rows.map((row) => new tag(row));
          resolve(tags);
        }
      });
    });
  }

  static async create(new_tag) {
    db.run("BEGIN TRANSACTION");

    try {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO tags VALUES(?,?);",
          [new_tag.id, new_tag.name],
          (error) => {
            if (error) reject(new db_exception(error.message));
            else resolve(this.lastID);
          }
        );
      });

      let movies = [];

      for (const movie_id of new_tag.movies) {
        const movieExists = await new Promise((resolve, reject) => {
          db.all(
            "SELECT * FROM movies WHERE id = ?",
            [movie_id],
            (error, rows) => {
              if (error) reject(new db_exception(error.message));
              else if (rows.length == 0) {
                resolve(false);
              } else {
                let _movie = rows.map((row) => new movie(row))[0];
                movies.push(_movie);
                resolve(true);
              }
            }
          );
        });

        if (!movieExists) {
          throw new Error(`Movie with id ${movie_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [movie_id, new_tag.id],
            (error) => {
              if (error) reject(new db_exception(error.message));
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      new_tag.movies = movies;

      return new_tag;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tags WHERE id = ?;", [id], async (error, rows) => {
        if (error) {
          reject(new db_exception(error.message));
        } else {
          const tags = rows.map((row) => new tag(row));
          if (tags.length == 0) resolve(null);
          else {
            const tag = tags[0];
            const movies = await new Promise((resolve, reject) => {
              db.all(
                "SELECT movies.title, movies_tags.movie_id FROM movies_tags INNER JOIN movies ON movies_tags.movie_id = movies.id WHERE movies_tags.tag_id = ?;",
                [tag.id],
                (error, rows) => {
                  if (error) reject(new db_exception(error.message));
                  else
                    resolve(
                      rows.map((row) => ({
                        id: row.movie_id,
                        title: row.title,
                      }))
                    );
                }
              );
            });
            tag.movies = movies;
            resolve(tag);
          }
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

        db.run("DELETE FROM tags WHERE id = ?;", [id], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  }

  static async update(updated_tag) {
    db.run("BEGIN TRANSACTION");
    try {
      const tagExists = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM tags WHERE id = ?", [updated_tag.id], (error, rows) => {
          if (error) reject(new db_exception(error.message));
          else if (rows.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!tagExists) {
        db.run("ROLLBACK");
        return null;
      }

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE tags SET name=? WHERE id=?;",
          [updated_tag.name, updated_tag.id],
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
        db.run(
          "DELETE FROM movies_tags WHERE tag_id = ?;",
          [updated_tag.id],
          (error) => {
            if (error) {
              reject(new db_exception(error.message));
            } else {
              resolve();
            }
          }
        );
      });

      let movies = [];

      for (const movie_id of updated_tag.movies) {
        const movieExists = await new Promise((resolve, reject) => {
          db.all(
            "SELECT * FROM movies WHERE id = ?",
            [movie_id],
            (error, rows) => {
              if (error) reject(new db_exception(error.message));
              else if (rows.length == 0) {
                resolve(false);
              } else {
                let _movie = rows.map((row) => new movie(row))[0];
                movies.push(_movie);
                resolve(true);
              }
            }
          );
        });

        if (!movieExists) {
          throw new Error(`Movie with id ${movie_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [movie_id, updated_tag.id],
            (error) => {
              if (error) reject(new db_exception(error.message));
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      updated_tag.movies = movies;

      return updated_tag;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }
}

module.exports = { TagRepository };
