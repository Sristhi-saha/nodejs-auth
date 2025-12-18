const jwt = require('jsonwebtoken')

const authMiddelware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("auth:",authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token Provided .please login to  continue"
        })
    }

    //decode this token
    try {
        const decodedTokenIfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("infp:",decodedTokenIfo);

        req.userInfo = decodedTokenIfo;

        next();

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }

}

module.exports = authMiddelware;