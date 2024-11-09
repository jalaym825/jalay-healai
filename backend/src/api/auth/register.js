const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Logger, Prisma, Mailer } = require("../../utils/index");


const register = asyncHandler(async (req, res, next) => {
    const { email,
        firstName,
        lastName,
        password,
        age,
        gender,
        height,
        weight,
        mobileNumber
    } = req.body;
    const user = await Prisma.users.findUnique({
        where: {
            email: email.toLowerCase(),
        },
    });
    if (user) {
        Logger.warn(`[/auth/register] - email already exists`);
        Logger.debug(`[/auth/register] - email: ${email}`);
        return next({ path: '/auth/register', statusCode: 400, message: "Email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await Prisma.$transaction(async (_prisma) => {
            const newUser = await _prisma.users.create({
                data: {
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    isPasswordSet: true,
                    age,
                    gender,
                    height,
                    weight,
                    mobileNumber
                },
            });

            Logger.info(`[/auth/register] - success - ${newUser.email}`);
            Logger.debug(`[/auth/register] - email: ${email}`);

            // send verification email with link
            const token = crypto.randomBytes(20).toString("hex");
            const verificationToken = await _prisma.verificationTokens.create({
                data: {
                    email: newUser.email,
                    token,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
                },
            });
            const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken.token}`;
            await Mailer.sendVerificationLink(newUser.email, verificationLink);

            // send jwt token
            const jwtToken = jwt.sign({ id: newUser.email }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            delete newUser.password;

            return res.status(200).json({
                token: jwtToken,
                user: newUser,
                message: "User created successfully",
            });
        }, { timeout: 10000 });
    } catch (transactionError) {
        return next({ path: '/auth/register', statusCode: 400, message: transactionError.message, extraData: transactionError });
    }
})

module.exports = register;