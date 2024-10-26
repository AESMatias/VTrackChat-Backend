import express from 'express';
import { UserService } from '../services/UserService';

import { UserController } from "../controller/UserController";

export let router = express.Router();


//Instance the service and pass it to the Controller
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", userController.register);
router.post("/login", userController.login);