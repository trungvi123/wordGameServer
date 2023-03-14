import { wordModel } from "../models/wordModel.js";
import { userModel } from "../models/userModel.js";
import { pendingWordModel } from "../models/pendingWordModel.js";
import { generateToken } from "../controllers/authController.js";
import jwt from "jsonwebtoken";

const getAllKey = async (req, res) => {
  return res.status(200).json({ state: "success" });
};

const getWord = async (req, res) => {
  const allWord = await wordModel.find();
  const indexWord = Math.floor(Math.random() * allWord.length);
  if(!allWord[indexWord]) return res.status(400).json({ state: "failure" });
  let wtoken = generateToken(allWord[indexWord]);
  wtoken = "SizurTePdhkzvE" + wtoken + "fghjaWawPznD";

  return res.status(200).json({ state: "success", wtoken });
};

const getTopUsers = async (req, res) => {
  try {
    const users = await userModel.find().sort({ maxScore: -1 }).limit(5);

    const data = users.map((e)=>{
      return {
        maxScore:e.maxScore,
        email:e.email
      }
    })

    return res.status(200).json({ state: "success", data });
  } catch (error) {
    return res.status(500);
  }
};

const testWord = async (req, res) => {
  try {
    const { word } = req.body;
    const result = await wordModel.findOne({ word });
    if (result)
      return res.status(200).json({ state: "success", message: "already" });

    return res.status(200).json({ state: "success", message: "yet" });
  } catch (error) {
    return res.status(500);
  }
};

const getAllPendingWord = async (req, res) => {
  const data = await pendingWordModel.find();

  return res.status(200).json({ state: "success", data });
};

const pendingWord = async (req, res) => {
  try {
    const { author, word, authorNote } = req.body;
    if (!author || !word) return res.status(200).json({ state: "failure" });
    const checkUser = await userModel.findOne({ email: author });
    if (!checkUser) return res.status(200).json({ state: "failure" });
    const newWord = new pendingWordModel({
      author,
      word,
      authorNote,
    });
    await newWord.save(); // them tu moi vao db
    return res.status(200).json({ state: "success" });
  } catch (error) {
    console.log(error);
  }
};

const createWord = async (req, res) => {
  try {
    const { author, word, authorNote } = req.body;
    const checkWord = await wordModel.findOne({ word: word });

    if (checkWord) {
      return res
        .status(200)
        .json({ state: "success", err: "This word already exists" });
    }

    const newWord = new wordModel({
      author,
      word,
      authorNote,
    });
    await newWord.save(); // them tu moi vao db

    const user = await userModel.findOne({ email: author });
    if (!user) return res.status(200).json({ state: "failure" });

    await userModel.findOneAndUpdate(
      { email: author },
      {
        wordContributed: [...user.wordContributed, {
          word,
          authorNote
        }],
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ state: "success" });
  } catch (error) {
    console.log(error);
  }
};

const udls = async (req, res) => {
  try {
    const id = req.params.id;
    const { score } = req.body;

    if (!score) return res.status(400).json({ state: "failure" });
    const user = await userModel.findById(id);
    const upuser = await userModel.findOneAndUpdate(
      { _id: id },
      { lastScore: score },
      {
        new: true,
      }
    );

    return res.status(200).json({ state: "success", upuser });
  } catch (error) {
    error;
  }
};

const udms = async (req, res) => {
  try {
    const id = req.params.id;
    const { score } = req.body;
   

    if (!score) return res.status(400).json({ state: "failure" });

    const cookieUp = req.cookies.ups;
   
    if (!cookieUp) return res.status(200).json({ state: "failure" });

    jwt.verify(cookieUp, process.env.SECRET_KEY, (err, data) => {
  
      if (err)
        return res
          .status(200)
          .json({ status: "failure", err: "Token is invalid" });
      
    });

    const user = await userModel.findById(id);
    if (score >= user.maxScore) {
    await userModel.findOneAndUpdate(
        { _id: id },
        { maxScore: score },
        {
          new: true,
        }
      );

      return res.status(200).json({ state: "success" });
    } else {
      return res.status(400).json({ state: "failure" });
    }
  } catch (error) {
    error;
  }
};

const deteleWord = async (req, res) => {
  try {
    const idReq = req.params.id;
    if (!idReq) return res.status(400).json({ state: "failure" });

    await pendingWordModel.findByIdAndDelete(idReq);
    return res.status(200).json({ state: "success" });
  } catch (error) {
    return res.status(500).json({ state: "failure" });
  }
};

export {
  getAllKey,
  getWord,
  createWord,
  udls,
  udms,
  pendingWord,
  testWord,
  getAllPendingWord,
  deteleWord,getTopUsers
};
