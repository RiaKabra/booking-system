import { newUser, getUserByEmail,loginUserService } from '../services/user.service.js';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        code: HttpStatus.CONFLICT,
        message: 'Email already exists. Please use a different email.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    };

    const createdUser = await newUser(user);
    return res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      message: 'User registered successfully',
      user: createdUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: 'User registration failed',
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const data = await loginUserService(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Login successful'
    });
    console.log(data)
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,

      message:  `${error}`
    });
  }
}