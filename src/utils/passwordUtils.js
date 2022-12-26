import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";


export const generateSalt = async () => {
    return await bcrypt.genSalt();
};

export const generatePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
    enteredPassword,
    savedPassword,
    salt
) => {
    return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateToken = async (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const validateToken = async (req) => {
    try {
        //first set Bearer token in vendor folder in thunder client(postman) ->setting ->any files inside this folder can access this token
        const token = req.get("Authorization");

        if (token) {
            const decodedUserData = jwt.verify(
                token.split(" ")[1],
                JWT_SECRET
            );

            req.user = decodedUserData;

            return true;
        }
        return false;
    } catch (error) {
        console.log(error);

    }
};