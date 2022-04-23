import { findTransactionById } from "../../db/dal/Transaction";
import { transferMoney } from "./TransferMoney";

export const refoundTransaction = (transactionId: string, senderId: string) => {
  const transaction = findTransactionById(transactionId).then((transaction) => {
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.alreadyRefounded) {
      throw new Error("Transaction already refounded");
    }

    if (transaction.senderID !== senderId) {
      throw new Error("You can't refound transactions you do not made!");
    }
    transferMoney(
      transaction.receiverID,
      transaction.senderID,
      transaction.amount,
      "refound"
    );
  });
};
