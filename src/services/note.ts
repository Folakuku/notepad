import { INote, NoteFilter } from "../interfaces/note.interface";
import { NoteModel } from "../models/note";
import { IResponse } from "../interfaces";
import { Types } from "mongoose";

export const addNote = async (payload: INote): Promise<IResponse> => {
  const note = (await new NoteModel(payload).save()).populate({
    path: "user",
    select: "-password",
  });
  return { status: true, message: "Note added", data: note };
};

export const editNote = async (
  userId: Types.ObjectId,
  payload: INote
): Promise<IResponse> => {
  let note = await NoteModel.findById(payload._id).populate({
    path: "user",
    select: "-password",
  });

  if (!note) {
    return { status: false, message: "NOT FOUND", data: {} };
  }

  if (userId.toString() != note.user._id.toString()) {
    return { status: false, message: "FORBIDDEN", data: {} };
  }
  note.content = payload.content;
  note.title = payload.title;
  await note.save();
  return { status: true, message: "Note edited", data: note };
};

export const deleteNote = async (
  userId: Types.ObjectId,
  noteId: Types.ObjectId
): Promise<IResponse> => {
  let note = await NoteModel.findById(noteId);

  if (!note) {
    return { status: false, message: "NOT FOUND", data: {} };
  }

  if (userId.toString() != note.user._id.toString()) {
    return { status: false, message: "FORBIDDEN", data: {} };
  }

  await note.deleteOne();

  return { status: true, message: "Note Deleted", data: {} };
};

export const findMyNotes = async (filter: NoteFilter): Promise<IResponse> => {
  let query: any = { user: filter.user };
  if (filter.startDate) {
    query.createdAt = { $gte: new Date(filter.startDate) };
  }

  if (filter.endDate) {
    query.createdAt = { ...query.createdAt, $lte: new Date(filter.endDate) };
  }

  if (filter.titleFilter) {
    query.title = { $regex: filter.titleFilter, $options: "i" };
  }
  const notes = await NoteModel.find(query).populate({
    path: "user",
    select: "-password",
  });

  return { status: true, message: "Notes fetched", data: notes };
};
