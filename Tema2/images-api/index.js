const express = require("express");
const bodyParser = require("body-parser");
const router = require("./images-router");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3003;

const middleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware);
app.use("/images", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
