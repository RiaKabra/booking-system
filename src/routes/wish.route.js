import express from 'express';
import * as wishController from '../controllers/wish.controller.js';
import {userAuth} from "../middlewares/auth.middleware.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/get/:_id',userAuth(process.env.SECRETKEY),wishController.getUserWish);
router.post('/add/:_id',  userAuth(process.env.SECRETKEY),wishController.addBookToUserWish); 
router.post('/remove/:_id',  userAuth(process.env.SECRETKEY),wishController.removeBookFromUserWish); 

export default router;
