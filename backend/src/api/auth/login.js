const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Prisma } = require("../../utils");
const logger = require("../../utils/logger");
const expressAsyncHandler = require("express-async-handler");


const login = expressAsyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        let user = await Prisma.users.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (!user) {
            logger.warn(`[/auth/login] - email not found`);
            logger.debug(`[/auth/login] - email: ${email}`);
            return res.status(400).json({
                message: "Email not found",
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logger.warn(`[/auth/login] - invalid password`);
            logger.debug(`[/auth/login] - email: ${email}`);
            return next({ path: '/auth/login', status: 400, message: "Invalid password" })
        }
        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        logger.info(`[/auth/login] - success - ${user.email}`);
        logger.debug(`[/auth/login] - email: ${email}`);

        // Remove sensitive data from user object
        delete user.password;
        delete user.sys_id;
        delete user.token;

        // Set the cookie with HttpOnly and Secure flags
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure Secure flag is true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            domain: 'localhost', // Set the domain of the cookie
        });

        return res.status(200).json({
            token,
            user,
        });
})

module.exports = login;