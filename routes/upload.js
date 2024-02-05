const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const controllerUpload = require("../controllers/upload");
const controller = require("../controllers/calls");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
});

router.post("/upload", upload.single("file"), controllerUpload.postUploadFile);
router.get("/get", controller.getData);
router.post("/updateCategory", controller.updateCategory);
router.delete("/deleteSession", controller.deleteSession);
router.post("/addPurchase", controller.addCategory);

module.exports = router;
