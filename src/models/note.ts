import { Schema, model } from "mongoose";
import { INote } from "../interfaces/note.interface";

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const NoteModel = model<INote>("note", noteSchema);
