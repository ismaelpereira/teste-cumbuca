import { findTransactionById } from "../../db/dal/Transaction";
import { transferMoney } from "./TransferMoney";

export const refoundTransaction = (transactionId: string) => {
  const transaction = findTransactionById(transactionId).then((transaction) => {
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.alreadyRefounded) {
      throw new Error("Transaction already refounded");
    }
    transferMoney(
      transaction.receiverID,
      transaction.senderID,
      transaction.amount,
      "refound"
    );
  });
};
