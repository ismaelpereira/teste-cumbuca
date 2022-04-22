import { DataTypes, Model, Optional } from "sequelize/types";
import { sequelizeConnection } from "../config";

interface IUser {
  ID: string;
  fullName: string;
  CPF: string;
  balance: number;
  token: string;
  createdAt: string;
}

class User extends Model implements IUser {
  public ID!: string;
  public fullName!: string;
  public CPF!: string;
  public balance!: number;
  public token!: string;
  public readonly createdAt!: string;
}

export interface UserInput extends Optional<IUser, "ID"> {}

export interface UserOutput extends Required<IUser> {}

User.init(
  {
    ID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    full_Name: {
      type: DataTypes.STRING,
    },
    CPF: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.NUMBER,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
  }
);

export default User;
