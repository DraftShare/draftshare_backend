import mongoose from "mongoose";
const { Schema } = mongoose;

// const wordSchema = new Schema(
//   {
//     word: String,
//     transcription: String,
//     translate: String,
//     definition: String,
//     author: { type: Schema.Types.ObjectId, ref: "User" },
//   },
//   { strict: false }
// );

const wordSchema = new Schema(
  {
    word: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    properties: [{type: Schema.Types.ObjectId, ref: "WordProperty"}]
  },
);

const wordPropertySchema = new Schema({
  word: {type: Schema.Types.ObjectId, ref: "Word"},
  name: String,
  value: String,
});

const userSchema = new Schema({
  tgId: String,
  username: String,
  words: [{ type: Schema.Types.ObjectId, ref: "Word" }],
});

export const Word = mongoose.model("Word", wordSchema);
export const WordProperty = mongoose.model("WordProperty", wordPropertySchema);
export const User = mongoose.model("User", userSchema);
