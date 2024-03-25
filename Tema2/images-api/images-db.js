const db = require("./db");

const saveImageDetails = async (movieId, image_location) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO images (movie_id, image_location) VALUES (?, ?)",
      [movieId, image_location],
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

const getImageDetails = async (movieId) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM images WHERE movie_id = ?", [movieId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const deleteImageDetails = async (movieId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM images WHERE movie_id = ?", [movieId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = { saveImageDetails, getImageDetails, deleteImageDetails };
