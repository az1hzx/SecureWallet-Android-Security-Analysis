import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error("Only image files (jpg, png, webp) are allowed."));
    },
});

const authRouter = express.Router();

authRouter.post('/register', errorHandler(userController.register));
authRouter.post('/login', errorHandler(userController.login));
authRouter.get('/profile', authGuard(), errorHandler(userController.getProfile));
authRouter.put('/profile', authGuard(), errorHandler(userController.updateProfile));
authRouter.put('/change-password', authGuard(), errorHandler(userController.changePassword));
authRouter.post('/upload-image', authGuard(), upload.single('image'), errorHandler(userController.uploadImage));

export default authRouter;
