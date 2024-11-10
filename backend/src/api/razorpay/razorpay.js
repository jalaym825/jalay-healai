const razorpay = require("razorpay")
const asyncHandler = require("express-async-handler")

const Payment = asyncHandler(async (req, res, next) => {

    const { amount } = req.body;

    console.log(amount)

    const instance = new razorpay({
        key_id: "rzp_test_kGF26SIu82U87v",
        key_secret: "Ho7YHrVItkEwDMDLaWxIh6kX"
    });

    const options = {
        amount: parseInt(amount * 100),
        currency: "INR",
        receipt: "receipt_order_10000",
        payment_capture: 1,
    }

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ message: "Some error occured" })

    res.status(200).json({
        success: true,
        order
    })

})

module.exports = Payment