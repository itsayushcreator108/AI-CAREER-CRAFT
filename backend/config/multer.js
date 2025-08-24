import multer from "multer";

// setup multer storage (using disk for temp files)
const storage = multer.diskStorage({});

export const upload = multer({ storage });
