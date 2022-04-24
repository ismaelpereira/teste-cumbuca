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

userRouter.get("/balance/:id", verifyToken, (req, res) => {
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
    throw new Error("For this route, you need to set a receiver");
  }

  if (!amount) {
    throw new Error("For this route, you need to set an amout");
  }

  findUserById(sender)
    .then((sender) => {
      findUserById(receiver)
        .then((receiver) => {
          transferMoney(
            sender.ID,
            receiver.ID,
            parseInt(amount, 10),
            "transfer"
          );
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

  findUserById(id)
    .then((transaction) => {})
    .catch(() => {
      throw new Error("User does not exist");
    });

  refoundTransaction(transactionId, id);

  updateTransaction(transactionId, {
    alreadyRefounded: true,
  }).then((transaction) => res.status(200).send(transaction));
});

userRouter.get("/:id/transactions", verifyToken, (req, res) => {
  let startDateParam = req.query.startDate?.toString();
  let endDateParam = req.query.endDate?.toString();
  const id = req.params.id;

  console.log("-----Params-----");
  console.log(startDateParam);
  console.log(endDateParam);
  console.log("-----Now-----");
  console.log(new Date());

  if (!startDateParam) {
    startDateParam = Date.now().toString();
  }
  if (!endDateParam) {
    endDateParam = Date.now().toString();
  }

  const unixStartDate = Date.parse(startDateParam);
  const unixEndDate = Date.parse(endDateParam);

  const startDate = new Date(unixStartDate);
  const endDate = new Date(unixEndDate);

  console.log("-----Parse-----");
  console.log(startDate);
  console.log(endDate);
  console.log("-----Test-----");
  console.log(Date.parse("2022-04-23T09:30:20"));
  console.log(Date.parse("2022-04-23 09:45:45"));
  console.log("-----Unix Test-----");
  console.log(new Date(unixStartDate));
  console.log(new Date(unixEndDate));
  filterTransactionsByDate(id, startDate, endDate).then((transferences) =>
    res.status(200).send(transferences)
  );
});
