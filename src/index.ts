import express from "express";
import { createUser } from "./db/dal/User";
import * as crypto from "crypto";
import { createToken } from "./authentication/auth";
import { router } from "./api/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello World",
  });
});

app.post("/register", (req, res) => {
  const user = req.body;
  const ID = crypto.randomUUID();
  const token = createToken(ID);
  createUser({
    ID: ID,
    ...user,
    token: token,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).then((user) => res.status(201).send(user));
});

app.listen(4000, () => {
  console.log("API is running on localhost:4000");
});
