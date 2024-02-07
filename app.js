const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const redis = require('redis');
const RedisStore = require("connect-redis").default

require("dotenv").config();

const client = redis.createClient();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

(async () => {
  await client.connect();
})();

const app = express();
const router = require("./routes/upload");

// Security enhancements with Helmet
app.use(helmet());
app.set('trust proxy', 1);
// Logging HTTP requests with Morgan
app.use(morgan("combined"));

// Rate limiting to protect against brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window (15 minutes)
});
app.use(limiter);

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

// Limiting the size of the request body for security
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  session({
    store: new RedisStore({ client: client }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
     // domain: '.budgees.com',
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
