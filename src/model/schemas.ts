import mongoose from "mongoose";
const { Schema } = mongoose;

const wordSchema = new Schema(
  {
    word: String,
    transcription: String,
    translate: String,
    definition: String,
  },
  { strict: false }
);

const userSchema = new Schema({
  tgId: String,
  username: String,
});

export const Word = mongoose.model("Word", wordSchema);
export const User = mongoose.model("User", userSchema);
