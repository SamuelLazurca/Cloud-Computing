const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TAGS_API_URL = process.env.TAGS_API_URL;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(TAGS_API_URL, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    const tags = response.data;
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags from external API:", error);
    res.status(500).json({ message: "Failed to fetch tags from external API" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${TAGS_API_URL}/${req.params.id}`, {
      headers: {
        "x-api-key": process.env.MOVIES_API_KEY,
      },
    });
    const tag = response.data;
    res.json(tag);
  } catch (error) {
    if (error.response.status === 404) {
      return res.status(404).json({ message: "Tag not found" });
    }
    console.error("Error fetching tag from external API:", error);
    res.status(500).json({ message: "Failed to fetch tag from external API" });
  }
});

module.exports = router;
