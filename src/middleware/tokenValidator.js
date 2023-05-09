const jwt = require("jsonwebtoken");

let secretKey = 'ghgvf6tgytytytvyftgyb7tv6rfr6r6f6tb';

const verifyToken = (req, res, next) => {
    console.log(req.headers)
    if (req.headers &&
        req.headers.authorization) {
        jwt.verify(req.headers.authorization, secretKey, async function (err, decoded) {
            if (err) {
                req.user = undefined;
                res.status(403).send("Forbidden");
                return;
            }

            req.user = decoded;
            next();
        });
    } else {
        res.status(403).send("Forbidden");
        req.user = undefined;
        next();
    }
};
module.exports = verifyToken;