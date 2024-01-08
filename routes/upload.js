const express = require("express");

const router = express();

router.post("/upload", controller.postUploadFile);