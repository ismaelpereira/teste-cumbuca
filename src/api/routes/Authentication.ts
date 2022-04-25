import { compareSync, hashSync } from "bcryptjs";
import { Router } from "express";
import { createToken } from "../../authentication/auth";
import { findUserByCPF, createUser, updateUser } from "../../db/dal/User";
import * as crypto from "crypto";

export const authenticationRoutes = Router();

authenticationRoutes.post("/register", (req, res) => {
  const user = req.body;
  const ID = crypto.randomUUID();
  const token = createToken(ID, user.password);
  findUserByCPF(user.CPF).then((user) => {
    if (user) {
      res.status(409).send({
        message: "User already exists. Please Login",
      });
      return;
    }
  });
  const encryptedPassword = hashSync(user.password, 10);
  createUser({
    ID: ID,
    ...user,
    password: encryptedPassword,
    token: token,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).then((user) => res.status(201).send(user));
});

authenticationRoutes.post("/login", (req, res) => {
  const { CPF, password } = req.body;
  if (!(CPF && password)) {
    res.status(400).send("CPF or Password empty");
  }

  findUserByCPF(CPF)
    .then((user) => {
      if (compareSync(password, user.password)) {
        const newToken = createToken(user.ID, password);
        updateUser(user.ID, {
          token: newToken,
        }).then((user) => res.status(200).send(user));
      } else {
        res.status(400).send({
          error: "CPF or Password does not match",
        });
        return;
      }
    })
    .catch(() => {
      res.status(400).send({
        error: "User does not exists. Please register!",
      });
      return;
    });
});
