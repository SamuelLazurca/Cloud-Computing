const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TICKETS_API_URL = process.env.TICKETS_API_URL;

router.post("/", async (req, res) => {
  try {
    const movie = req.body;
    const response = await axios.post(TICKETS_API_URL, movie, {
      headers: {
        "x-api-key": process.env.TICKETS_API_KEY,
      },
    });
    res.status(response.status).json();
  } catch (error) {
    console.error("Error fetching tickets from external API:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch tickets from external API" });
  }
});

module.exports = router;
