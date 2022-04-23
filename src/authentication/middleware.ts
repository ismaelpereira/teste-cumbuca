require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const tokenKey = process.env.JWT_SECRET as string;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(403).send("Unauthorized");
  }
  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    res.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ");

  try {
    const decodedToken = jwt.verify(token[1], tokenKey);
  } catch (err) {
    console.log(err);
    res.status(403).send("Invalid JWT Token");
  }
  next();
};
