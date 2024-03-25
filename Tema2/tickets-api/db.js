const sql = require("sqlite3");

let db = new sql.Database("./tickets.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

/*db.run(
  "CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, name TEXT, email TEXT, movie_id TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);*/

module.exports = db;
