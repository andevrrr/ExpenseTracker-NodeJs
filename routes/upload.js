const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const controllerUpload = require('../controllers/upload');
const controller = require('../controllers/calls');

router.get("/get", controller.getData);
router.post("/upload", upload.single('file'), controllerUpload.postUploadFile);

module.exports = router;
