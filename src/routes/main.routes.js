import express from "express";
import { assignHTTPError, errorResponder, invalidPathHandler } from "../middlewares/error.middlewares.js";
import authRouter from "./auth.routes.js";
import cardsRouter from "./cards.routes.js";
const router = express.Router();

router.use('/auth', authRouter)
router.use('/cards', cardsRouter)

router.use(assignHTTPError);
router.use(errorResponder);
router.use(invalidPathHandler);

export default router;