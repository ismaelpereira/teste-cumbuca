require("dotenv").config();
import * as jwt from "jsonwebtoken";

const token = process.env.JWT_SECRET as string;

export const createToken = (id: string, password: string) => {
  const jwtToken = jwt.sign(
    { id: id, password: Buffer.from(password).toString("base64") },
    token,
    {
      expiresIn: "2h",
    }
  );

  return jwtToken;
};
