require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const tokenKey = process.env.JWT_SECRET as string;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token[0], tokenKey);
    console.log(decodedToken);
  } catch (err) {
    res.status(403).send("Invalid JWT Token");
  }
  next();
};
