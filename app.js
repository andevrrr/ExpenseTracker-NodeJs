const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
require("dotenv").config();
const router = require("./routes/upload");

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
