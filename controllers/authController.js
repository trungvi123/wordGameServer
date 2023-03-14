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
    { expiresIn: "6h" }
  );
};

const generateToken = (word) => {
  //word
  return jwt.sign(
    {
      w: word.word,
      author: word.author,
      authorNote: word.authorNote,
    },
    process.env.SECRET_KEY,
    { expiresIn: "3h" }
  );
};

const generateCookie = () => {
  return jwt.sign(
    {
      mes: "cookie for update score",
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
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
  try {
    const { email, password, confirmPassword } = req.body;

    let already = await userModel.findOne({ email });

    if (already)
      return res
        .status(401)
        .json({ err: "Tai khoan da ton tai", status: "failure" });

    if (password === confirmPassword) {
      const newUser = new userModel({
        email,
        password,
      });

      await newUser.save();
      return res.status(200).json({ state: "success" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
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
      secure: true,
      path: "/",
      sameSite: "none",
    });

    return res.status(200).json({
      email,
      _id: user._id,
      accessToken,
      ms: user.maxScore,
      state: "success",
      wordContributed: user.wordContributed,
    });
  } catch (error) {
    console.log(error);
    return res.status(500);
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

const changePassword = async (req, res) => {
  const { email, password, newpassword } = req.body;

  const user = await userModel.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ err: "Khong tim thay user", status: "failure" });

  const compare = await bcrypt.compare(password, user.password);
  if (!compare)
    return res
      .status(401)
      .json({ err: "Mat khau khong chinh xac", status: "failure" });

  // tao ma hoa matkhau moi
  const salt = bcrypt.genSaltSync(10);
  const passwordHashed = bcrypt.hashSync(newpassword, salt);
  const newpass = passwordHashed; // done
  await userModel.findOneAndUpdate(
    { email },
    { password: newpass }
  );

  return res
      .status(200)
      .json({status: "success" });
};

const getCookie = async (req, res) => {
  try {
    const cookie = generateCookie();
    res.cookie("ups", cookie, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });
    return res.status(200).json({ state: "success" });
  } catch (error) {
    console.log(error);
  }
};

export { signIn, signUp, refreshTokeMethod, getCookie, generateToken ,changePassword};
