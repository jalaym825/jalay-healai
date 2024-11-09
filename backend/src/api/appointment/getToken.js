const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken")

const getToken = asyncHandler(async (req, res, next) => {

    const {userId} = req.body;

    if (!userId) {
        return next({
            path: '/appointment/getToken', statusCode: 400, message: "UserID is required!"
        })
    }

    const token = await jwt.sign({ user_id: userId }, "wk8qegtn7utdfn3y6pzpnc7sw4hzktqar727xfcqrtej3fhwk8xqsykweun54s5a");

    return res.status(200).json({
        message: "Token fetched successfully!",
        token: token
    })


})
module.exports = getToken;