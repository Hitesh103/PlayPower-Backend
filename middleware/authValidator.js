import jwt from "jsonwebtoken";
import {JWT_SCREATE_KEY} from "../config/config.js";

const secretKey = JWT_SCREATE_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token) {
      const decode = jwt.verify(token, secretKey);
      req.user_id = decode?.id;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(403).send("access denied");
  }
};

export default authMiddleware;