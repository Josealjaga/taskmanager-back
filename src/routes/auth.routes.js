import { Router } from "express";
import { body, } from 'express-validator';
import { forgotPassword, login, resetPassword, signup } from "./../controllers/auth.controller.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import upload from "../multerConfig.js";

const authRouter = Router();

authRouter.post(
    '/login',
  [
    body('email')
      .isString()
      .notEmpty(), 
    body('password')
      .isString()
      .notEmpty(),
  ], validatorMiddleware,
  login
);

authRouter.post('/signup',
    upload.single('fotoperfil'),
  [
    body('email')
      .isEmail()
      .withMessage('El email debe tener un formato válido'),
    body('password')
      .isStrongPassword()
      .withMessage('La contraseña debe cumplir con los requisitos de seguridad'),
    body('name')
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
  ], 
  validatorMiddleware,
  signup
);

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

export default authRouter;