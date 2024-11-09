const Logger = require("./logger");
const Mailer = require("./mailer.js");
const Prisma = require("./prismaClient");

module.exports = { Logger, Prisma, Mailer };