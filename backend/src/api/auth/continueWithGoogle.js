const expressAsyncHandler = require("express-async-handler");

const continueWithGoogle = expressAsyncHandler(async (req, res) => {
    console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_REDIRECT_URI);
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
})

module.exports = continueWithGoogle