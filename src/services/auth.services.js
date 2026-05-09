import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

const authServices = {
    async getUserPayload(user) {
        const payload = {
            user: user.id,
        };

        const authToken = jwt.sign(payload, process.env.JWT_AUTHENTICATION_SECRET);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userImage: user.userImage,
                createdAt: user.createdAt,
            },
            authToken,
        };
    },

    async register(name, email, password) {
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser)
            throw new createError.Conflict("A user with this email already exists.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
            },
        });

        return this.getUserPayload(user);
    },

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user)
            throw new createError.Unauthorized("Invalid email or password.");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            throw new createError.Unauthorized("Invalid email or password.");

        return this.getUserPayload(user);
    },

    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, userImage: true, createdAt: true },
        });

        if (!user)
            throw new createError.NotFound("User not found.");

        return { user };
    },

    async updateProfile(userId, name, email) {
        if (email) {
            const existing = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });
            if (existing && existing.id !== userId)
                throw new createError.Conflict("Email is already in use.");
        }

        const data = {};
        if (name) data.name = name;
        if (email) data.email = email.toLowerCase();

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, email: true, userImage: true, createdAt: true },
        });

        return { user };
    },

    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new createError.NotFound("User not found.");

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            throw new createError.Unauthorized("Current password is incorrect.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: "Password changed successfully" };
    },

    async uploadImage(userId, filename) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { userImage: filename },
            select: { id: true, name: true, email: true, userImage: true, createdAt: true },
        });

        return { user };
    },
};

export default authServices;
