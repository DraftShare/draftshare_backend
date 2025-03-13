import mongoose from "mongoose";
const { Schema } = mongoose;

// const cardSchema = new Schema(
//   {
//     word: String,
//     transcription: String,
//     translate: String,
//     definition: String,
//     author: { type: Schema.Types.ObjectId, ref: "User" },
//   },
//   { strict: false }
// );

const cardSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  properties: [{ type: Schema.Types.ObjectId, ref: "CardProperty" }],
});

const propertySchema = new Schema({
  name: String,
  cardProperties: [{ type: Schema.Types.ObjectId, ref: "CardProperty" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const cardPropertySchema = new Schema({
  card: { type: Schema.Types.ObjectId, ref: "Card" },
  property: { type: Schema.Types.ObjectId, ref: "Property" },
  value: String,
});

const userSchema = new Schema({
  tgId: String,
  username: String,
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
});

export const Card = mongoose.model("Card", cardSchema);
export const Property = mongoose.model("Property", propertySchema);
export const CardProperty = mongoose.model("CardProperty", cardPropertySchema);
export const User = mongoose.model("User", userSchema);
