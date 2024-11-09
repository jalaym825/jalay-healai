const logger = require("../utils/logger.js");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { Prisma } = require('../utils/index.js'); // Adjust the import according to your project structure

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

    const user = await Prisma.users.findUnique({
        where: {
            email: payload.id
        }
    });

    if (!user) {
        logger.warn(`[/middleware/verifyJWT] - user not found`);
        logger.debug(`[/middleware/verifyJWT] - user: ${payload.id}`);
        return next({ path: "/middleware/verifyJWT", statusCode: 401, message: "User not found" });
    }

    logger.info(`[/middleware/verifyJWT] - user: ${user.email} authenticated`);
    req.user = user;
    next();
});

module.exports = verifyJWT;