import express from 'express';
import * as bookController from '../controllers/book.controller.js'
import {userAuth,roleMiddleware,isAdmin} from "../middlewares/auth.middleware.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('',userAuth(process.env.SECRETKEY),bookController.getAllbooks);
router.get('/:_id',userAuth(process.env.SECRETKEY),bookController.getBookbyID);
router.delete('/:_id',userAuth(process.env.SECRETKEY), isAdmin, bookController.deleteBookAdmin);

export default router;


