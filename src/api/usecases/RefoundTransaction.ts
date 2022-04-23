import { findTransactionById } from "../../db/dal/Transaction";
import { TransferMoney } from "./TransferMoney";

export const RefoundTransaction = (transactionId: string) => {
  const transaction = findTransactionById(transactionId).then((transaction) => {
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.alreadyRefounded) {
      throw new Error("Transaction already refounded");
    }
    TransferMoney(
      transaction.receiverID,
      transaction.senderID,
      transaction.amount
    );
  });
};
