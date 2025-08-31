const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; 
           req.user = { id: decoded.id || decoded._id || decoded.userId };
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = { userAuth };
