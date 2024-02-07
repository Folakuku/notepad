import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { UserModel } from "../models/user";
import { EmptyResponse } from "../interfaces";
import { GraphQLError } from "graphql";
const secretKey = process.env.JWT_SECRET;

export const capitalize = (word: string): string => {
  return word[0].toUpperCase() + word.slice(1);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync(10);
  return await bcrypt.hash(password, salt);
};

export const compareHashedPassword = async (
  password: string,
  hashedPassword: string
): Promise<Boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signJwt = (payload: IUser): string => {
  return jwt.sign(
    {
      _id: payload._id,
      email: payload.email,
    },
    secretKey,
    { expiresIn: "1w" }
  );
};

export const decodeToken = async (
  token: string
): Promise<IUser | GraphQLError | null> => {
  const payload: any = jwt.verify(token, secretKey);
  const user = await UserModel.findById(payload._id);
  if (!user) {
    return new GraphQLError(`AUTHORIZATION ERROR`, {
      extensions: { code: "UNPROCESSABLE ENTITY" },
    });
  }
  user.set("password", null);
  if (!user) {
    return null;
  }
  return user;
};

export const checkEmpty = (input: object): EmptyResponse => {
  let empty = false;
  let message = [];
  for (const key in input) {
    if (input[key].trim().length == 0) {
      empty = true;
      message.push(`${key} cannot be an empty string`);
    }
  }
  return { empty, message };
};

export const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};
