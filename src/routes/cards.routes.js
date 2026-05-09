import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import cardsController from "../controllers/cards.controllers.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const cardsRouter = express.Router();

cardsRouter.post('/', authGuard(), errorHandler(cardsController.create));
cardsRouter.get('/', authGuard(), errorHandler(cardsController.getAll));
cardsRouter.get('/:id', authGuard(), errorHandler(cardsController.getById));
cardsRouter.put('/:id', authGuard(), errorHandler(cardsController.update));
cardsRouter.delete('/:id', authGuard(), errorHandler(cardsController.delete));

export default cardsRouter;
