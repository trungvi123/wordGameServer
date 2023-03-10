import mongoose from "mongoose";

const pendingWordSchema = mongoose.Schema({
  word: {
    type: String,
    require: true,
    unique: true,
  },
  author: {
    type: String,
    default: "Ẩn danh",
  },
  authorNote: {
    type: String,
    default: null,
  },
});

export const pendingWordModel = mongoose.model(
  "pendingWord_wordGame",
  pendingWordSchema
);
