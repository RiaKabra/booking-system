import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const newUser = async (body) => {
  const data = await User.create(body);
  return data;
};

export const loginUserService = async (body) => {
  try {
    const login = await User.findOne({ email: body.email });

    if (!login) {
      throw new Error('Invalid email');
    }
    const passwordMatch = await bcrypt.compare(body.password, login.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { 
          email: login.email, 
          role: login.role 
        },
        process.env.SECRETKEY, 
      );

      return token;
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    throw new Error('Login failed');
  }
};