import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User';
import { config } from '../config';
import { profile } from 'winston';

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  
    const { speechLanguage, profilePictureURL } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      res.status(401).json({ error: "Authorization token is required" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
  
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      if (speechLanguage && typeof speechLanguage === "string") user.speechLanguage = speechLanguage;
      if (profilePictureURL && typeof profilePictureURL === "string") user.profilePictureURL = profilePictureURL;
  
      // We save the updated user to the database
      await user.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          username: user.username,
          tokens: user.tokens,
          loggedIn: true,
          speechLanguage: user.speechLanguage,
          profilePictureURL: user.profilePictureURL,
        },
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to update profile", details: error });
    }
  };
