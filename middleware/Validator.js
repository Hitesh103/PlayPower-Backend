import { StatusCodes } from "http-status-codes";
import Joi from "joi";

class Validator {
  authValidator = async (req, res, next) => {
    try {
      const authSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.number().valid(0, 1).required(),
        email: Joi.string().email().required(),
      });

      const { error } = authSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
          success: false,
          err: "Client Error",
          data: [],
        });
      }

      next();
    } catch (error) {
      console.log("Error in the Validation :(");
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
        err: "Server Error",
        data: [],
      });
    }
  };
}

export default Validator;
