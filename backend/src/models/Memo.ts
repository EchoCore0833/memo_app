
import mongoose, { Schema, Document } from "mongoose";

export interface IMemo extends Document {
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memoSchema = new Schema<IMemo>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    content: {
      type: String,
      default: "",
      maxlength: 10000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Memo = mongoose.model<IMemo>("Memo", memoSchema);
