import { validateToken } from "../../utils/passwordUtils.js";

export const userAuth = async (req, res, next) => {

    const isAuthorized = await validateToken(req);
    if (isAuthorized) {
        return next();
    }
    return res.status(403).json({ message: 'Not Authorized' })
}