const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken")

const getToken = asyncHandler(async (req, res, next) => {

    const userID = req.user.email;

    if (!userID) {
        return next({
            path: '/videocall/getToken', statusCode: 400, message: "UserID is required!"
        })
    }

    const token = await jwt.sign({ user_id: userID }, process.env.JWT_SECRET);

    return res.status(200).json({
        message: "Token fetched successfully!",
        token: token
    })


})
module.exports = getToken;