var logger = require("../logger.js");
const log = logger.log;
var db = require("../db.js").db;
var tag = require("../entities/tag.js").Tag;

class TagRepository {
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tags;", [], (error, rows) => {
        if (error) {
          reject(error);
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
          (err) => {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
      
      for (const movie_id of new_tag.movies) {
        const movieExists = await new Promise((resolve, reject) => {
          db.get(
            "SELECT COUNT(*) AS count FROM movies WHERE id = ?",
            [movie_id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row.count > 0);
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
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      return new_tag;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tags WHERE id = ?;", [id], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const tags = rows.map((row) => new tag(row));
          console.log(JSON.stringify(tags));
          if (tags.length == 0) resolve(null);
          else resolve(tags[0]);
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
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tags SET name=? WHERE id=?;",
        [updated_tag.name, updated_tag.id],
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(updated_tag);
          }
        }
      );
    });
  }

  static async update(updated_tag) {
    db.run("BEGIN TRANSACTION");
    try {
      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE tags SET name=? WHERE id=?;",
          [updated_tag.name, updated_tag.id],
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
          "DELETE FROM movies_tags WHERE tag_id = ?;",
          [updated_tag.id],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      for (const movie_id of updated_tag.movies) {
        const movieExists = await new Promise((resolve, reject) => {
          db.get(
            "SELECT COUNT(*) AS count FROM movies WHERE id = ?",
            [movie_id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row.count > 0);
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
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }

      db.run("COMMIT");

      return updated_tag;
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }
}

module.exports = { TagRepository };
