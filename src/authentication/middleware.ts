require("dotenv").config();
import * as jwt from "jsonwebtoken";

const tokenKey = process.env.JWT_SECRET as string;

export const verifyToken = (req, res, next) => {
  const token = req.headers["x-acess-token"];
  if (!token) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, tokenKey);
    req.user = decodedToken;
  } catch (err) {
    res.status(403).send("Invalid JWT Token");
  }
  return next();
};
