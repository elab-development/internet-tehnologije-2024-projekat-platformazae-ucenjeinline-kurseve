import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.model.js';

export const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userName,
    userEmail,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
};

export const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: 'Wrong credentials',
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '2d',
    }
  );

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
