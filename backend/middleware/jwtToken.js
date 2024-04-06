const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
    const secrekey = "voeNYEWxB7q9hpEb44ybI1euSio57AlL"

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ status: 401, message: "Unuthorized" });
        jwt.verify(token, secrekey, (err, decode) => {
            if (err) return res.status(401).json({ status: 401, message: "Error token" });
            req.user = decode;
            next()
        })
    } catch (error) {
        return res.status(401).json({ status: 401, message: "Invalid token" });
    }

}

module.exports = { authenticateToken }