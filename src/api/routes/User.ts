import { Router } from "express";
import { verifyToken } from "../../authentication/middleware";
import { findUserById } from "../../db/dal/User";

export const userRouter = Router();

userRouter.get("/balance/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  findUserById(id).then((user) => {
    res.status(200).send({
      ID: user.ID,
      balance: `R$: ${(user.balance / 100).toFixed(2)}`,
    });
  });
});
