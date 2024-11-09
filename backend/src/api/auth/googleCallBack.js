const expressAsyncHandler = require("express-async-handler");
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Prisma:prisma } = require("../../utils");


const googleCallBack = expressAsyncHandler(async (req, res, next) => {
    const { code } = req.query;

    // Exchange authorization code for access token
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    // Check if user exists in the database
    let user = await prisma.users.findUnique({
        where: {
            email: profile.email.toLowerCase(),
        },
    });
    if (!user) {
        // If user doesn't exist, create a new one
        user = await prisma.users.create({
            data: {
                firstName: profile.given_name,
                lastName: profile.family_name,
                email: profile.email.toLowerCase(),
                isVerified: true,
                password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10),
                isPasswordSet: false
            },
        });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.sys_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Set the cookie with HttpOnly and Secure flags
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
    });

    // Redirect to frontend with success parameter
    res.redirect(`${process.env.FRONTEND_URL}`);
});


module.exports = googleCallBack;