const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
  saveImageDetails,
  getImageDetails,
  deleteImageDetails,
} = require("./images-db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const imageDetails = await getImageDetails(movieId);
    let imagePath = "uploads/logo.jpeg";

    if (imageDetails) {
      imagePath = imageDetails.image_location;
    }

    const imageData = await fs.promises.readFile(imagePath);

    res.setHeader("Content-Type", "image/jpeg");
    res.send(imageData);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:id", upload.single("file"), async (req, res) => {
  try {
    const movieId = req.params.id;
    const image_location = req.file.path;

    await saveImageDetails(movieId, image_location);
  } catch (error) {
    console.error("Error saving image details:", error);
    res.status(500).send("Internal Server Error");
    return;
  }

  res.send("Image uploaded!");
});

router.delete("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const imageDetails = await getImageDetails(movieId);

    if (imageDetails) {
      await deleteImageDetails(movieId);
      await fs.promises.unlink(imageDetails.image_location);
    }

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

module.exports = router;
