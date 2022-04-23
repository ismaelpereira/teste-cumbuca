import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config";

interface ITransaction {
  ID: string;
  senderID: string;
  receiverID: string;
  amount: number;
  alreadyRefounded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class Transaction extends Model implements ITransaction {
  public ID!: string;
  public senderID!: string;
  public receiverID!: string;
  public amount!: number;
  public alreadyRefounded!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface TransactionInput extends Optional<ITransaction, "ID"> {}

export interface TransactionOutput extends Required<ITransaction> {}

Transaction.init(
  {
    ID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    senderID: {
      type: DataTypes.STRING,
    },
    receiverID: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    alreadyRefounded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
  }
);

export default Transaction;
