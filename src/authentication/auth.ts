require("dotenv").config();
import * as jwt from "jsonwebtoken";

const token = process.env.JWT_SECRET as string;

export const createToken = (id: string) => {
  const jwtToken = jwt.sign({ id: id }, token);

  return jwtToken;
};
