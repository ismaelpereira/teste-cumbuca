import { Router } from "express";
import { verifyToken } from "../../authentication/middleware";
import {
  createTransaction,
  filterTransactionsByDate,
  updateTransaction,
} from "../../db/dal/Transaction";
import { findUserById } from "../../db/dal/User";
import { transferMoney } from "../usecases/TransferMoney";
import * as crypto from "crypto";
import { refoundTransaction } from "../usecases/RefoundTransaction";

export const userRouter = Router();

userRouter.get("/:id/balance", verifyToken, (req, res) => {
  const id = req.params.id;
  findUserById(id).then((user) => {
    res.status(200).send({
      ID: user.ID,
      balance: `R$:${(user.balance / 100).toFixed(2)}`,
    });
  });
});

userRouter.post("/:id/transaction", verifyToken, (req, res) => {
  const sender = req.params.id;
  const receiver = req.query.receiver?.toString();
  const amount = req.query.amount?.toString();

  if (!receiver) {
    res.status(400).send({
      error: "You need to set a receiver!",
    });
    return;
  }

  if (!amount) {
    res.status(400).send({
      error: "You need to set a amount!",
    });
    return;
  }

  findUserById(sender)
    .then((sender) => {
      findUserById(receiver)
        .then((receiver) => {
          try {
            transferMoney(
              sender.ID,
              receiver.ID,
              parseInt(amount, 10),
              "transfer"
            );
          } catch (err) {
            res.status(500).send({
              error: err,
            });
          }
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
          res.status(404).send({
            error: "Sender does not exist",
          });
          return;
        });
    })
    .catch(() => {
      res.status(404).send({
        error: "Receiver does not exist",
      });
      return;
    });
});

userRouter.post("/:id/refound/:transactionId", verifyToken, (req, res) => {
  const transactionId = req.params.transactionId;
  const id = req.params.id;

  findUserById(id)
    .then((transaction) => {})
    .catch(() => {
      res.status(404).send({
        error: "User does not exist",
      });
      return;
    });
  try {
    refoundTransaction(transactionId, id);
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
  updateTransaction(transactionId, {
    alreadyRefounded: true,
  }).then((transaction) => res.status(200).send(transaction));
});

userRouter.get("/:id/transactions", verifyToken, (req, res) => {
  let startDateParam = req.query.startDate?.toString();
  let endDateParam = req.query.endDate?.toString();
  const id = req.params.id;

  if (!startDateParam) {
    res.status(400).send({
      error: "You need to set an start Date",
    });
    return;
  }
  if (!endDateParam) {
    endDateParam = Date.now().toString();
  }

  const startDate = new Date(startDateParam).toISOString();
  const endDate = new Date(endDateParam).toISOString();

  filterTransactionsByDate(id, startDate, endDate).then((transferences) =>
    res.status(200).send(transferences)
  );
});
