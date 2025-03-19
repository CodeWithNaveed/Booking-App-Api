import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong credentials!"));

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        );

        const { password, isAdmin, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin });

    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        // Fetch the user from the database
        const user = await User.findById(req.params.id);
        if (!user) return next(createError(404, "User not found!"));

        // Check if the old password is provided
        if (!req.body.oldPassword) {
            return next(createError(400, "Old password is required!"));
        }

        // Compare old password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(
            req.body.oldPassword,
            user.password || "" // Default to an empty string to prevent "undefined" error
        );

        if (!isPasswordCorrect) {
            return next(createError(400, "Wrong old password!"));
        }

        // Validate new password presence
        if (!req.body.newPassword) {
            return next(createError(400, "New password is required!"));
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.newPassword, salt);

        // Update the user's password
        user.password = hash;
        await user.save();

        res.status(200).send("Password has been updated.");
    } catch (err) {
        next(err);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).send("Logged out successfully!");
    } catch (err) {
        next(err);
    }
};
