import { Types } from "mongoose";

export interface INote {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  user?: Types.ObjectId;
}

export interface NoteFilter {
  user: Types.ObjectId;
  startDate?: string;
  endDate?: string;
  titleFilter?: string;
}
