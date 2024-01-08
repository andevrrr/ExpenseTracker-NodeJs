const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configures multer to save files in /uploads directory
const router = express.Router();
const controller = require('../controllers/upload'); // Make sure to create this file in /controllers

router.post("/upload", upload.single('file'), controller.postUploadFile);

module.exports = router;
