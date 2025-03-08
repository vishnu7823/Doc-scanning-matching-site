const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/plain") {
        cb(null, true);
    } else {
        cb(new Error("Only .txt files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
