const expressAsyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils");

const updateSubscription = expressAsyncHandler(async (req, res, next) => {
    const user = req.user;

    const { plan } = req.body;

    const userData = await Prisma.users.findFirst({
        where: {
            email: user.email
        }
    })

    if (!userData) {
        return next({
            path: '/razorpay/updateSubscription', statusCode: 404, message: "User not found!"
        })
    }

    await Prisma.users.update({
        where: {
            email: user.email
        },
        data: {
            subscription: plan.price == 500 ? "PREMIUM" : "PLATINUM"
        }
    })

    return res.status(200).json({
        message: "Subscription buy successfully!"
    })
})

module.exports = updateSubscription