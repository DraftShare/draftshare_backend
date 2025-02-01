import mongoose from "mongoose";
const { Schema } = mongoose;

const wordSchema = new Schema(
  {
    word: String,
    transcription: String,
    translate: String,
    definition: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { strict: false }
);

const userSchema = new Schema({
  tgId: String,
  username: String,
  words: [{ type: Schema.Types.ObjectId, ref: "Word" }],
});

export const Word = mongoose.model("Word", wordSchema);
export const User = mongoose.model("User", userSchema);
