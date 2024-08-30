import { Router } from "express";
import { getAllUsers, updateUser, getUserById } from "./../controllers/users.controller.js";
import upload from "../multerConfig.js";

const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/UserById', getUserById);
usersRouter.put('/', upload.single('fotoperfil'), updateUser);

export default usersRouter;