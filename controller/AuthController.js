import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { User } from "../model/index.js";
import { verifyPassword, createToken } from "../utills/authUtills.js";

class AuthController {
  constructor() {
    this.user = new User();
  }

  Auth = async (req, res) => {
    try {
      const { username, password,  role ,email } = req.body;

      console.log(req.body);

      const existingUser = await this.user.findOne({ username });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        const user_id = uuidv4();
        const newUser = await this.user.create({
          username,
          user_id: user_id,
          password: newPassword,
          email: email,
          role,
        });

        return this.sendTokenResponse(
          res,
          {
            user_id: user_id,
            role
          },
          "You are successfully registered and logged in"
        );
      }

      const passwordMatch = verifyPassword(password, existingUser.password);

      if (!passwordMatch) {
        throw new Error("Incorrect credentials");
      }

      return this.sendTokenResponse(
        res,
        existingUser,
        "You are successfully logged in"
      );
    } catch (error) {
      console.error("Error in Auth:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  };

  sendTokenResponse = (res, user, message) => {
    const token = createToken(user);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: { "token" : token, user_id : user.user_id },
      message,
    });
  };
}

export default AuthController;
