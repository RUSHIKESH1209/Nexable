import jwt from 'jsonwebtoken';


// just authuser middlerware and sever userId 
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };  // Attach it in a standard place

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
