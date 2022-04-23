import { Router } from "express";
import { verifyToken } from "../../authentication/middleware";
import { createTransaction } from "../../db/dal/Transaction";
import { findUserById } from "../../db/dal/User";
import { TransferMoney } from "../usecases/TransferMoney";
import * as crypto from "crypto";

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

userRouter.post("/:id/transaction", verifyToken, (req, res) => {
  const sender = req.params.id;
  const receiver = req.query.receiver?.toString();
  const amount = req.query.amount?.toString();

  if (!receiver) {
    throw new Error("For this route, you need to set a receiver");
  }

  if (!amount) {
    throw new Error("For this route, you need to set an amout");
  }

  findUserById(sender)
    .then((sender) => {
      findUserById(receiver)
        .then((receiver) => {
          TransferMoney(sender.ID, receiver.ID, parseInt(amount, 10));
          createTransaction({
            ID: crypto.randomUUID(),
            senderID: sender.ID,
            receiverID: receiver.ID,
            amount: parseInt(amount, 10),
            alreadyRefounded: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }).then((transaction) => res.status(201).send(transaction));
        })
        .catch(() => {
          throw new Error("Receiver does not exist");
        });
    })
    .catch(() => {
      throw new Error("Sender does not exist");
    });
});

userRouter.post("/:id/refound/:transactionId", verifyToken, (req, res) => {
  const transactionId = req.params.transactionId;
  const id = req.params.id;

  findUserById(id).catch(() => {
    throw new Error("User does not exist");
  });
});
