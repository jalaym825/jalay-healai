import logger from "../utils/logger.js";
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient'; // Adjust the import according to your project structure

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        logger.warn(`[/middleware/verifyJWT] - token missing`);
        logger.debug(`[/middleware/verifyJWT] - token: ${token}`);
        return next({ path: "/middleware/verifyJWT", statusCode: 401, message: "No token provided" });
    }

    const payload = await jwt.verify(token.toString(), process.env.JWT_SECRET);

    if (!payload.id) {
        logger.warn(`[/middleware/verifyJWT] - invalid token`);
        logger.debug(`[/middleware/verifyJWT] - token: ${token}`);
        return next({ path: "/middleware/verifyJWT", statusCode: 401, message: "Invalid token" });
    }

    const user = await prisma.users.findUnique({
        where: {
            sys_id: payload.id
        }
    });

    if (!user) {
        logger.warn(`[/middleware/verifyJWT] - user not found`);
        logger.debug(`[/middleware/verifyJWT] - user: ${payload.id}`);
        return next({ path: "/middleware/verifyJWT", statusCode: 401, message: "User not found" });
    }

    logger.info(`[/middleware/verifyJWT] - user: ${user.sys_id} authenticated`);
    req.user = user;
    next();
});

export default verifyJWT;