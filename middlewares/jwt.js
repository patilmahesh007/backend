import jwt from "jsonwebtoken";

const jwtmiddleware = (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};



const checkRoleMiddleware = (req, res, next) => {
    const role = (req.user.role);
    const path = req.path;
    const method=req.method;
    console.log(req?.user?.role);

    if (method === "POST" && path === "/products" && role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
    }
    next();
};

export  {jwtmiddleware,checkRoleMiddleware};
