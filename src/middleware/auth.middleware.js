import jwt from "jsonwebtoken";

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();


} catch (error) {
    return res.status(401).json({ message: "Invalid token" });
    
}
    
}

export default authUserMiddleware;