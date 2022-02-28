const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.get('Authorization');

    if (!header) {
        return res.status(401).json({
            message: 'cant validate the user',
        });
    }

    const token = header.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'sunrotateseasttowestanditwillneverchange');
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }

    if (!decodedToken) {
        return res.status(401).json({
            message: 'Not authenticated',
        });
    }

    req.userId = decodedToken.userId;
    next();
};
