import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User'; // Import your User model
import { config } from '../config';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the default profile data
    const newUser = new User({
      email,
      password: hashedPassword,
      username: email, // Username is set to email by default
      currentPlan: 0, // Default to Normal plan
      tokens: 100,
      loggedIn: false,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, config.jwtSecret, {
      expiresIn: '336h', // Customize expiration as needed
    });

    // Send response with the user data and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        currentPlan: newUser.currentPlan,
        tokens: newUser.tokens,
        loggedIn: newUser.loggedIn
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user', details: error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, id: user._id }, config.jwtSecret, {
      expiresIn: '336h',  // Customize expiration as needed
    });

    // Send back the user profile data and the token
    res.status(200).json({
      token,
      user: {
        username: user.username,
        currentPlan: user.currentPlan,
        tokens: user.tokens,
        loggedIn: true
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error });
  }
};
