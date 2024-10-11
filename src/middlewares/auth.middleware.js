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
          code: HttpStatus.UNAUTHORIZED,
          message: "Authorization token is required"
        };
      }
      
      
      const token = bearerToken = bearerToken.split(' ')[1];
      let userDetails = jwt.verify(token, secretKey);
      console.log('Decoded token payload:', userDetails);

      if (!userDetails.email || !userDetails.role) {
        throw {
          code: HttpStatus.UNAUTHORIZED,
          message: "Invalid token payload"
        };
      }

      const user = await getUserByEmail(userDetails.email);
      if (!user) {
        throw {
          code: HttpStatus.UNAUTHORIZED,
          message: "User not found"
        };
      }

      
      req.user = { 
        id: user._id,    
        role: user.role 
      };

      console.log('Authenticated user ID:', user._id);
      console.log('User role:', user.role);
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(error.code || HttpStatus.BAD_REQUEST).json({
        code: error.code || HttpStatus.BAD_REQUEST,
        message: error.message || "Invalid or expired token"
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












