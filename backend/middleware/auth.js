import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  // 1. read the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // 2. header looks like "Bearer <token>" — take the token part
  const token = authHeader.split(" ")[1];

  try {
    // 3. verify signature + expiry, get the payload back
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. attach the user id to the request for the route to use
    req.userId = decoded.userId;

    // 5. all good — hand off to the actual route
    next();
  } catch (err) {
    // 6. token is invalid or expired
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
