const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ================= CORRECT ABSOLUTE PATH ================= */
const uploadPath = path.join(
  process.cwd(),
  "public",
  "admin",
  "profile"
);

// console.log("UPLOAD PATH:", uploadPath);

/* ================= ENSURE FOLDER EXISTS ================= */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `admin_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files allowed"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
