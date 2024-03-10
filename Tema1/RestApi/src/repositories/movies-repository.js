var logger = require("../logger.js");
const log = logger.log;
var db = require("../db.js").db;
var movie = require("../entities/movie.js").Movie;

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
          (err) => {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      for (const tag_id of new_movie.tags) {
        const tagExists = await new Promise((resolve, reject) => {
          db.get(
            "SELECT COUNT(*) AS count FROM tags WHERE id = ?",
            [tag_id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row.count > 0);
            }
          );
        });

        if (!tagExists) {
          throw new Error(`Tag with id ${tag_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [new_movie.id, tag_id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

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
          reject(error);
        } else {
          const movies = rows.map((row) => new movie(row));
          resolve(movies);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM movies WHERE id = ?;", [id], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const movies = rows.map((row) => new movie(row));
          console.log(JSON.stringify(movies));
          if (movies.length == 0) resolve(null);
          else resolve(movies[0]);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run("PRAGMA foreign_keys=ON;", function (error) {
        if (error) {
          reject(error);
          return;
        }

        db.run("DELETE FROM movies WHERE id = ?;", [id], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  }

  static async update(id, updated_movie) {
    db.run("BEGIN TRANSACTION");
    try {
      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE movies SET title=?, year=?, director=?, rating=? WHERE id=?;",
          [
            updated_movie.title,
            updated_movie.year,
            updated_movie.director,
            updated_movie.rating,
            id,
          ],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      await new Promise((resolve, reject) => {
        db.run(
          "DELETE FROM movies_tags WHERE movie_id = ?;",
          [id],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      for (const tag_id of updated_movie.tags) {
        const tagExists = await new Promise((resolve, reject) => {
          db.get(
            "SELECT COUNT(*) AS count FROM tags WHERE id = ?",
            [tag_id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row.count > 0);
            }
          );
        });

        if (!tagExists) {
          throw new Error(`Tag with id ${tag_id} does not exist.`);
        }

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO movies_tags (movie_id, tag_id) VALUES (?, ?)",
            [id, tag_id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      return updated_movie;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }
}

module.exports = { MoviesRepository };
