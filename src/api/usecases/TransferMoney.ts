import * as crypto from "crypto";

import { createTransaction } from "../../db/dal/Transaction";
import { findUserById, updateUser } from "../../db/dal/User";

export const transferMoney = (
  senderId: string,
  receiverId: string,
  amount: number,
  type: "transfer" | "refound"
) => {
  const sender = findUserById(senderId).then((sender) => {
    if (!sender) {
      throw new Error("Sender not found");
    }

    if (type === "transfer" && sender.balance < amount) {
      throw new Error(
        "User can't transfer money. Reason: Insufficient balance"
      );
    }
    findUserById(receiverId).then((receiver) => {
      if (!receiver) {
        throw new Error("Receiver not found");
      }
      sender.balance -= amount;
      receiver.balance += amount;

      updateUser(senderId, {
        balance: sender.balance,
      });
      updateUser(receiverId, {
        balance: receiver.balance,
      });
    });
  });
};
