let express = require("express");
let app = express();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let nodemailer = require("nodemailer");
let uuid = require("uuid");
let bodyParser = require("body-parser");
let saveTicket = require("./save-ticket").saveTicket;
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3002;

const middleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware);

app.post("/ticket", async (req, res) => {
  let body = req.body;

  if (
    !(body.movie_id && body.name && body.movie && body.location && body.email)
  ) {
    res.status(400).send("All input is required");
    return;
  }

  if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(body.email)) {
    res.status(400).send("Invalid email");
    return;
  }

  const ticketId = uuid.v4();

  ejs.renderFile(
    path.join(__dirname, "./", "ticket-template.ejs"),
    {
      name: body.name,
      movie: body.movie,
      id: ticketId,
      location: body.location,
    },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        let options = {
          height: "3.5in",
          width: "5.5in",
        };
        pdf.create(data, options).toFile("ticket.pdf", async (err) => {
          if (err) {
            res.status(500).send(err);
            return;
          } else {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.USER,
                pass: process.env.PASS,
              },
            });

            let mailOptions = {
              from: "Movies Shop Cinema",
              to: body.email,
              subject: "Movie Ticket",
              text: "Here is your movie ticket",
              attachments: [
                {
                  filename: "ticket.pdf",
                  path: "./ticket.pdf",
                  contentType: "application/pdf",
                },
              ],
            };

            try {
              await saveTicket({
                id: ticketId,
                name: body.name,
                email: body.email,
                movie_id: body.movie_id,
              });
              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  res.status(500).send(err);
                  return;
                }
                res.send("Email sent");
              });
            } catch (error) {
              res.status(500).send(error);
              return;
            }
          }
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
