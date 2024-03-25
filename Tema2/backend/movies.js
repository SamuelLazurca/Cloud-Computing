const express = require("express");
const router = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const MOVIES_API_URL = process.env.MOVIES_API_URL;
const IMAGES_API_URL = process.env.IMAGES_API_URL;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(MOVIES_API_URL, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    const movies = response.data;
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies from external API:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch movies from external API" });
  }
});

router.get("/image/:id", async (req, res) => {
  try {
    const response = await axios.get(`${IMAGES_API_URL}/${req.params.id}`, {
      responseType: "arraybuffer",
      headers: {
        "x-api-key": process.env.IMAGES_API_KEY,
      },
    });
    const image = response.data;
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(image);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Image not found" });
    }
    console.error("Error fetching image from external API:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch image from external API" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${MOVIES_API_URL}/${req.params.id}`, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    const movie = response.data;

    res.json(movie);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Movie not found" });
    }
    console.error("Error fetching movie from external API:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch movie from external API" });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const movieData = JSON.parse(req.body.data);
    console.log(movieData);
    const imagePath = req.file.path;

    const response = await axios.post(MOVIES_API_URL, movieData, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    const movieId = response.data.id;

    const imageData = await fs.promises.readFile(imagePath);

    const formData = new FormData();
    formData.append("file", imageData, {
      filename: req.file.path,
      contentType: req.file.mimetype,
    });

    const imageResponse = await axios.post(
      `${IMAGES_API_URL}/${movieId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.IMAGES_API_KEY,
        },
      }
    );

    fs.unlinkSync(req.file.path);

    res.status(201).json();
  } catch (error) {
    console.error("Error creating movie in external API:", error);
    res.status(500).json({ message: "Failed to create movie in external API" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await axios.delete(`${MOVIES_API_URL}/${req.params.id}`, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    await axios.delete(`${IMAGES_API_URL}/${req.params.id}`, {
      headers: {
        "x-api-key": process.env.IMAGES_API_KEY,
      },
    });
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting movie from external API:", error);
    res
      .status(500)
      .json({ message: "Failed to delete movie from external API" });
  }
});

module.exports = router;
