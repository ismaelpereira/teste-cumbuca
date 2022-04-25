import { findTransactionById } from "../../db/dal/Transaction";
import { transferMoney } from "./TransferMoney";

export const refoundTransaction = (transactionId: string, senderId: string) => {
  const transaction = findTransactionById(transactionId).then((transaction) => {
    if (!transaction) {
      return new Error("Transaction not found");
    }
    if (transaction.alreadyRefounded) {
      return new Error("Transaction already refounded");
    }

    if (transaction.senderID !== senderId) {
      return new Error("You can't refound transactions you do not made!");
    }
    transferMoney(
      transaction.receiverID,
      transaction.senderID,
      transaction.amount,
      "refound"
    );
  });
};
