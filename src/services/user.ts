import {
  capitalize,
  hashPassword,
  compareHashedPassword,
  signJwt,
} from "../helpers/utlis";
import { IResponse } from "../interfaces";
import { IUser, LoginParam } from "../interfaces/user.interface";
import { UserModel } from "../models/user";

export const createUser = async (payload: IUser): Promise<IResponse> => {
  payload.email = payload.email.toLowerCase();
  payload.username = capitalize(payload.username);
  payload.password = await hashPassword(payload.password);

  let exists = await UserModel.findOne({ email: payload.email });
  if (exists) {
    return {
      status: false,
      message: "User with email already exists",
      data: {},
    };
  }
  exists = await UserModel.findOne({ username: payload.username });
  if (exists) {
    return {
      status: false,
      message: "User with username already exists",
      data: {},
    };
  }

  const user = await new UserModel(payload).save();
  user.set("password", undefined);
  const token = signJwt(user);

  return {
    status: true,
    message: "user account created",
    data: { token, user },
  };
};

export const login = async (payload: LoginParam): Promise<IResponse> => {
  payload.email = payload.email.toLowerCase();

  const user = await UserModel.findOne({ email: payload.email });
  if (!user) {
    return {
      status: false,
      message: "Invalid details",
      data: {},
    };
  }

  const validPassword = await compareHashedPassword(
    payload.password,
    user.password
  );
  if (!validPassword) {
    return {
      status: false,
      message: "Invalid details",
      data: {},
    };
  }
  user.set("password", undefined);
  const token = signJwt(user);

  return {
    status: true,
    message: "Login successful",
    data: { token, user },
  };
};
