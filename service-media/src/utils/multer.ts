import multer from "multer";

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log("FILTER", file);
    const whitelist = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    if (!whitelist.includes(file.mimetype)) {
      return callback(null, false);
    }

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(null, false);
    }

    callback(null, true);
  },
});

export default uploadMiddleware;
