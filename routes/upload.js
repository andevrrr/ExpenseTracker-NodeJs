const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: CSV Files Only!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 },
});

const router = express.Router();
const controllerUpload = require("../controllers/upload");
const controller = require("../controllers/calls");

router.post("/upload", upload.single("file"), controllerUpload.postUploadFile);
router.get("/get", controller.getData);
router.post("/updateCategory", controller.updateCategory);
router.delete("/deleteSession", controller.deleteSession);
router.post("/addPurchase", controller.addCategory);

module.exports = router;
