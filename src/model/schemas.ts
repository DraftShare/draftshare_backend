import mongoose from "mongoose";
const { Schema } = mongoose;

const wordSchema = new Schema({
  word: String,
  transcription: String,
  translate: String,
  definition: String,
}, {strict: false});

export const Word = mongoose.model("Word", wordSchema);
