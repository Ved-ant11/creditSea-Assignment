const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createReport,
  getReports,
  getReportById,
} = require("../controllers/reportController");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isXmlMime =
      file.mimetype === "text/xml" || file.mimetype === "application/xml";

    if (ext === ".xml" || isXmlMime) {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error("Only XML files are allowed"), { status: 400 })
      );
    }
  },
});

router.post("/upload", upload.single("file"), createReport);
router.get("/", getReports);
router.get("/:id", getReportById);

module.exports = router;
