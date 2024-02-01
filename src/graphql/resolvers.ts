import { GraphQLError } from "graphql";
import { createUser, login } from "../services/user";
import { IUser } from "../interfaces/user.interface";
import { addNote, deleteNote, editNote, findMyNotes } from "../services/note";
import { Types } from "mongoose";
import { NoteFilter } from "../interfaces/note.interface";
import { checkEmpty, isEmail } from "../helpers/utlis";

export const resolvers = {
  Mutation: {
    createUser: async (
      _: any,
      args: { username: string; email: string; password: string },
      context: { user: IUser }
    ) => {
      const isEmpty = checkEmpty(args);
      if (isEmpty.empty) {
        return new GraphQLError(`${isEmpty.message}`, {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const validEmail = isEmail(args.email);
      if (!validEmail) {
        return new GraphQLError("Email input is not valid", {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const response = await createUser(args);
      if (!response.status) {
        return new GraphQLError(response.message);
      }

      return response.data;
    },

    login: async (
      _: any,
      args: { email: string; password: string },
      context: { user: IUser }
    ) => {
      const isEmpty = checkEmpty(args);
      if (isEmpty.empty) {
        return new GraphQLError(`${isEmpty.message}`, {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const validEmail = isEmail(args.email);
      if (!validEmail) {
        return new GraphQLError("Email input is not valid", {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const response = await login(args);
      if (!response.status) {
        return new GraphQLError(response.message);
      }
      const user = response.data;
      return user;
    },

    addNote: async (
      _: any,
      args: { title: string; content: string },
      context: { user: IUser }
    ) => {
      if (!context.user) {
        return new GraphQLError("Login required", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const isEmpty = checkEmpty(args);
      if (isEmpty.empty) {
        return new GraphQLError(`${isEmpty.message}`, {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const input = { ...args, user: context.user._id };
      const response = await addNote(input);
      if (!response.status) {
        return new GraphQLError(response.message);
      }
      return response.data;
    },

    editNote: async (
      _: any,
      args: { _id: Types.ObjectId; title: string; content: string },
      context: { user: IUser }
    ) => {
      if (!context.user) {
        return new GraphQLError("Login required", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const isEmpty = checkEmpty(args);
      if (isEmpty.empty) {
        return new GraphQLError(`${isEmpty.message}`, {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const response = await editNote(context.user._id, args);
      if (!response.status) {
        return new GraphQLError(response.message);
      }
      return response.data;
    },

    deleteNote: async (
      _: any,
      args: { _id: Types.ObjectId },
      context: { user: IUser }
    ) => {
      if (!context.user) {
        return new GraphQLError("Login required", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const isEmpty = checkEmpty(args);
      if (isEmpty.empty) {
        return new GraphQLError(`${isEmpty.message}`, {
          extensions: { code: "UNPROCESSABLE ENTITY" },
        });
      }

      const response = await deleteNote(context.user._id, args._id);
      if (!response.status) {
        return new GraphQLError(response.message);
      }
      return response.status;
    },
  },

  Query: {
    myNotes: async (_, filter: NoteFilter, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      filter.user = user._id;

      const notes = await findMyNotes(filter);
      return notes.data;
    },

    currentUser: async (_, __, context) => {
      if (!context.user) {
        return new GraphQLError("Login required", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      return context.user;
    },
  },
};
