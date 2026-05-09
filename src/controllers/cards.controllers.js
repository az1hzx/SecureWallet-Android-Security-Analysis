import cardsServices from "../services/cards.services.js";
import { dataResponse, messageResponse } from "../utils/responses.js";

const cardsController = {
    async create(req, res, next) {
        const resBody = await cardsServices.create(req.user, req.body);
        return res.status(201).send(dataResponse("Card created successfully", resBody));
    },

    async getAll(req, res, next) {
        const resBody = await cardsServices.getAll(req.user);
        return res.status(200).send(dataResponse("Cards fetched successfully", resBody));
    },

    async getById(req, res, next) {
        const resBody = await cardsServices.getById(req.user, req.params.id);
        return res.status(200).send(dataResponse("Card fetched successfully", resBody));
    },

    async update(req, res, next) {
        const resBody = await cardsServices.update(req.user, req.params.id, req.body);
        return res.status(200).send(dataResponse("Card updated successfully", resBody));
    },

    async delete(req, res, next) {
        await cardsServices.delete(req.user, req.params.id);
        return res.status(200).send(messageResponse("Card deleted successfully"));
    },
};

export default cardsController;
