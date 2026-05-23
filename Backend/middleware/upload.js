import multer from "multer";
import { cloudinaryStorage } from "../config/cloudinary.js";

const upload = multer({ storage: cloudinaryStorage });

export default upload;
