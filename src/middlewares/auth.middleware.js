import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../services/user.service.js'; 


export const userAuth = (secretKey) => {
  return async (req, res, next) => {
    try {
      let bearerToken = req.header('Authorization');
      console.log("Bearer token before split----->", bearerToken);

      if (!bearerToken) {
        throw {
          code: HttpStatus.BAD_REQUEST,
          message: "Authorization token is required"
        };
      }
      bearerToken = bearerToken.split(' ')[1];
      let userDetails = jwt.verify(bearerToken, secretKey);
      req.body.role = userDetails.role
      console.log('user details----------', userDetails.role);
      next();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: "Invalid or expired token"
      });
    }
  }
}



export const roleMiddleware = async (req, res, next) => {
  const path = req.path;
  const email = req.body.email; 

  if (path.includes('/user/register')) {
    const existingAdmin = await getUserByEmail(email);
    if (existingAdmin && existingAdmin.role === "admin") {
      return res.status(400).json({ message: 'Email is already registered ' });
    }
    req.body.role = "user";
  } else if (path.includes('/admin/register')) {
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.role === "user") {
      return res.status(400).json({ message: 'Email is already registered ' });
    }
    req.body.role = "admin";
  } else {
    return res.status(400).json({ message: 'Invalid registration' });
  }
  
  next();
};


export const isAdmin = (req, res, next) => {
  if (req.body.role !== "admin") { 
    return res.status(HttpStatus.FORBIDDEN).json({
      code: HttpStatus.FORBIDDEN,
      message: 'Access denied. Admins only.'
    })
  }
  next(); 
};












