const express = require('express')
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require("./routes/upload");

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})