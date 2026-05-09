import { PrismaClient } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

const cardsServices = {
    async create(userId, data) {
        const card = await prisma.cards.create({
            data: {
                userId,
                cardNumber: data.cardNumber,
                cardHolder: data.cardHolder,
                expiryDate: data.expiryDate,
                cvv: data.cvv,
                bankName: data.bankName,
                balence: data.balence,
                creditScore: data.creditScore,
                cardType: data.cardType,
            },
        });

        return { card };
    },

    async getAll(userId) {
        const cards = await prisma.cards.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return { cards };
    },

    async getById(userId, cardId) {
        const card = await prisma.cards.findUnique({
            where: { id: cardId },
        });

        if (!card)
            throw new createError.NotFound("Card not found.");

        if (card.userId !== userId)
            throw new createError.Forbidden("You don't have access to this card.");

        return { card };
    },

    async update(userId, cardId, data) {
        const existing = await prisma.cards.findUnique({
            where: { id: cardId },
        });

        if (!existing)
            throw new createError.NotFound("Card not found.");

        if (existing.userId !== userId)
            throw new createError.Forbidden("You don't have access to this card.");

        const card = await prisma.cards.update({
            where: { id: cardId },
            data,
        });

        return { card };
    },

    async delete(userId, cardId) {
        const existing = await prisma.cards.findUnique({
            where: { id: cardId },
        });

        if (!existing)
            throw new createError.NotFound("Card not found.");

        if (existing.userId !== userId)
            throw new createError.Forbidden("You don't have access to this card.");

        await prisma.cards.delete({
            where: { id: cardId },
        });

        return { message: "Card deleted successfully" };
    },
};

export default cardsServices;
