import authServices from "../services/auth.services.js";
import { dataResponse, messageResponse } from "../utils/responses.js";

const userController = {
    async register(req, res, next) {
        const { name, email, password } = req.body;
        const resBody = await authServices.register(name, email, password);
        return res.status(201).send(dataResponse("User registered successfully", resBody));
    },

    async login(req, res, next) {
        const { email, password } = req.body;
        const resBody = await authServices.login(email, password);
        return res.status(200).send(dataResponse("Login successful", resBody));
    },

    async getProfile(req, res, next) {
        const resBody = await authServices.getProfile(req.user);
        return res.status(200).send(dataResponse("Profile fetched successfully", resBody));
    },

    async updateProfile(req, res, next) {
        const { name, email } = req.body;
        const resBody = await authServices.updateProfile(req.user, name, email);
        return res.status(200).send(dataResponse("Profile updated successfully", resBody));
    },

    async changePassword(req, res, next) {
        const { currentPassword, newPassword } = req.body;
        await authServices.changePassword(req.user, currentPassword, newPassword);
        return res.status(200).send(messageResponse("Password changed successfully"));
    },

    async uploadImage(req, res, next) {
        if (!req.file)
            return res.status(400).send({ success: false, message: "No file uploaded" });

        const resBody = await authServices.uploadImage(req.user, req.file.filename);
        return res.status(200).send(dataResponse("Image uploaded successfully", resBody));
    },
};

export default userController;
