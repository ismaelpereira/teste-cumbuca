import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config";

interface IUser {
  ID: string;
  fullName: string;
  CPF: string;
  balance: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Model implements IUser {
  public ID!: string;
  public fullName!: string;
  public CPF!: string;
  public balance!: number;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface UserInput extends Optional<IUser, "ID"> {}

export interface UserOutput extends Required<IUser> {}

User.init(
  {
    ID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    CPF: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.INTEGER,
    },
    token: {
      type: DataTypes.STRING,
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

export default User;
