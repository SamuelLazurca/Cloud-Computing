const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const moviesRouter = require("./movies");
const tagsRouter = require("./tags");
const ticketsRouter = require("./tickets");

app.use("/movies", moviesRouter);
app.use("/tags", tagsRouter);
app.use("/ticket", ticketsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
