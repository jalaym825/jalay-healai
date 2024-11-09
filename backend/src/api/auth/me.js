const expressAsyncHandler = require("express-async-handler");

const getMe = expressAsyncHandler(async(req, res, next) => {
    res.status(200).json({
        user: req.user,
    });
})

module.exports = getMe;