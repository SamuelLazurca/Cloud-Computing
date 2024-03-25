const sql = require("sqlite3");

let db = new sql.Database("./images.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

/*db.run("DROP TABLE IF EXISTS images", (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(
  "CREATE TABLE IF NOT EXISTS images (movie_id TEXT PRIMARY KEY, image_location TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);*/

module.exports = db;
