import jwt from "jsonwebtoken";

export const checkAccessToken = async (req, res, next) => {
  try {
 
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken)
      return res.status(200).json({ state: "failure", err: "Token not found" });

    jwt.verify(accessToken, process.env.SECRET_KEY, (err, data) => {
      if (err)
        return res.status(200).json({ state: "failure", err: "Invalid token" });

      next();
    });
  } catch (error) {
    return res.status(500).json({ state: "failure" });
  }
};


export const checkAdminAccessToken = async (req, res, next) => {
  try {
 
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken)
      return res.status(200).json({ state: "failure", err: "Token not found" });

    jwt.verify(accessToken, process.env.SECRET_KEY, (err, data) => {
      if (err)
        return res.status(200).json({ state: "failure", err: "Invalid token" });
      // console.log(data);
      next();
    });
  } catch (error) {
    return res.status(500).json({ state: "failure" });
  }
};
