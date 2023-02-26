import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { userModel } from "../models/userModel.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.SECRET_KEY,
    { expiresIn: "2s" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.SECRET_REFRESH_KEY,
    { expiresIn: "365d" }
  );
};

const signUp = async (req, res) => {
  const { userName, password, comfirmPassword } = req.body;
  let already = await userModel.findOne({ userName });

  if (already)
    return res
      .status(401)
      .json({ err: "Tai khoan da ton tai", status: "failure" });

  if (password === comfirmPassword) {
    const newUser = new userModel({
      userName,
      password,
    });

    await newUser.save();
    return res.status(200).json({ newUser });
  }
};

const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await userModel.findOne({ userName });
    if (!user)
      return res
        .status(401)
        .json({ err: "Khong tim thay user", status: "failure" });

    const compare = await bcrypt.compare(password, user.password);
    if (!compare)
      return res
        .status(401)
        .json({ err: "Mat khau khong chinh xac", status: "failure" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    return res.status(200).json({
      userName,
      id: user._id,
      accessToken,
      state: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshTokeMethod = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(200)
      .json({ state: "failure", err: "RefreshToken not found" });

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (err, data) => {
    if (err)
      return res
        .status(200)
        .json({ state: "failure", err: "Token khong hop le" });
    const newAccessToken = generateAccessToken(data);

    return res
      .status(200)
      .json({ state: "success", accessToken: newAccessToken });
  });
};

export { signIn, signUp, refreshTokeMethod };
