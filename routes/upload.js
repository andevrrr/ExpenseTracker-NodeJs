const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const controllerUpload = require("../controllers/upload");
const controller = require("../controllers/calls");

router.post("/upload", upload.single("file"), controllerUpload.postUploadFile);
router.get("/get", controller.getData);
router.post('/updateCategory', controller.updateCategory);
router.delete('/deleteSession', controller.deleteSession);

module.exports = router;
