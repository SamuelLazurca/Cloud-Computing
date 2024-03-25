const db = require("./db");

const saveTicket = async (ticket) => {
  await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO tickets (id, name, email, movie_id) VALUES (?, ?, ?, ?)",
      [ticket.id, ticket.name, ticket.email, ticket.movie_id],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

module.exports = {
  saveTicket,
};
