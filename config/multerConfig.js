import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
    console.log(uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

export default upload;
