const { merge } = require('lodash');
const ApiError = require('../utils/apiError');

const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    let error = {
        message: err.message || 'Something went wrong',
    };
    if (err.extraData) {
        error = merge(error, { extraData: err.extraData });
    }
    if (!err.statusCode)
        err.statusCode = 400;
    // throw new ApiError(err.statusCode, err.message)
    res.status(err.statusCode).send(new ApiError(err.statusCode, err.message, error, err.stack));
}

module.exports = errorMiddleware;