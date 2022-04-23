import Transaction, {
  TransactionInput,
  TransactionOutput,
} from "../model/Transaction";

export const createTransaction = async (
  payload: TransactionInput
): Promise<TransactionOutput> => {
  const transaction = await Transaction.create(payload);
  return transaction;
};

export const findTransactionById = async (
  id: string
): Promise<TransactionOutput> => {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  return transaction;
};

export const findAllTransactions = async (): Promise<TransactionOutput[]> => {
  return await Transaction.findAll();
};

export const updateTransaction = async (
  id: string,
  payload: Partial<TransactionInput>
): Promise<TransactionOutput> => {
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }
  const updatedTransaction = await (transaction as Transaction).update(payload);
  return updatedTransaction;
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  const deletedTransaction = await Transaction.destroy({ where: { id } });
  return !!deletedTransaction;
};
