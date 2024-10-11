import express from 'express';
import * as cartController from '../controllers/cart.controller.js'
import {userAuth} from "../middlewares/auth.middleware.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/get/:_id',userAuth(process.env.SECRETKEY),cartController.getUserCart);
router.post('/add/:_id',  userAuth(process.env.SECRETKEY),cartController.addBookToUserCart); 
router.post('/remove/:_id',  userAuth(process.env.SECRETKEY),cartController.removeBookFromUserCart); 
export default router;
