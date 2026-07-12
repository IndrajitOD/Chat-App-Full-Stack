import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    };

    const isDev = !process.env.NODE_ENV || process.env.NODE_ENV.trim() === "development";

    if (!isDev) {
        cookieOptions.sameSite = "strict";
        cookieOptions.secure = true;
    } else {
        delete cookieOptions.sameSite;
        delete cookieOptions.secure;
    }

    res.cookie("jwt", token, cookieOptions);

    return token;
};