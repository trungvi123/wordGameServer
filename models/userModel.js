import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique:true
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = bcrypt.hashSync(this.password, salt);
    this.password = passwordHashed; // done
    next();
  } catch (error) {
    console.log(error);
  }
});

export const userModel = mongoose.model("userSchema_wordGame", userSchema);
