import { validationResult, } from 'express-validator';

const validatorMiddleware = async (req, res, next) => {
  const result = validationResult(req);

   console.log(result.array());
   
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Schema validation error',
        errors: result.array(),
      });
  }

  next();
};

export default validatorMiddleware;