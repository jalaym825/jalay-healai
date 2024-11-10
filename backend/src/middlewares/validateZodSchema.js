const asyncHandler = require("express-async-handler");
const validateSchema = (schema) => asyncHandler(async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    }
    catch (err) {
        next({ path: `${req.originalUrl}/middleware/validate`, status: 422, message: err.errors[0].message, extraData: err.errors })
    }
})

module.exports = validateSchema;