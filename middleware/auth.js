const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send({message: 'Error de autorización'});
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_KEY);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).send({message: 'Error de autorización'});
    }
}

module.exports = auth;