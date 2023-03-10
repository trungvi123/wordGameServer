import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  email: {
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
  maxScore: {
    type: Number,
    default: 0
  },
  lastScore: {
    type: Number,
    default: 0
  },
  wordContributed: {
    type : Array,
    default: []
  }

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
 