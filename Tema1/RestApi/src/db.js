var sqlite3 = require("sqlite3");
var logger = require("./utils/logger.js");

const log = logger.log;

const db = new sqlite3.Database(
  "D:\\Licenta\\Anul3Sem2\\Cloud Computing\\Homeworks\\Tema1\\RestApi\\src\\my_db.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) log.error(err);
  }
);


/*db.exec(
  `
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS movies_tags; 
PRAGMA foreign_keys = ON;
CREATE TABLE movies (id TEXT PRIMARY KEY, title TEXT, year INTEGER, director TEXT, rating REAL);
CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE movies_tags (
  movie_id TEXT,
  tag_id TEXT,
  PRIMARY KEY (movie_id, tag_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(movie_id, tag_id)
);
INSERT INTO movies (id, title, year, director, rating) VALUES('7702eb8a-1769-4071-bdc8-4796eb316be5', 'The Shawshank Redemption', 1994, 'Frank Darabont', 9.3);
INSERT INTO movies (id, title, year, director, rating) VALUES('7702eb8a-1769-4071-bdc8-4796eb316be6', 'The Godfather', 1972, 'Francis Ford Coppola', 9.2);
INSERT INTO movies (id, title, year, director, rating) VALUES('7702eb8a-1769-4071-bdc8-4796eb316be7', 'The Dark Knight', 2008, 'Christopher Nolan', 9.0);
INSERT INTO tags (id, name) VALUES('d0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3e', 'drama');
INSERT INTO tags (id, name) VALUES('d0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3f', 'crime');
INSERT INTO tags (id, name) VALUES('d0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3g', 'action');
INSERT INTO tags (id, name) VALUES('d0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3h', 'thriller');
INSERT INTO movies_tags (movie_id, tag_id) VALUES('7702eb8a-1769-4071-bdc8-4796eb316be5', 'd0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3e');
INSERT INTO movies_tags (movie_id, tag_id) VALUES('7702eb8a-1769-4071-bdc8-4796eb316be5', 'd0f8e4e3-3b3e-4f3e-8f3e-3b3e4f3e8f3f');
`,
  (error) => {
    if (error) {
      console.log(error);
    }
  }
);*/

module.exports = { db };
