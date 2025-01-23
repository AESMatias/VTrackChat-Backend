import mongoose, { Document, Schema } from 'mongoose';

export enum SpeechRecordingStatus {
  Inactive = 0,
  Recording = 1,
  Error = 2,
}

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  tokens: number;
  loggedIn: boolean;
  speechLanguage: string;
  profilePictureURL: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    default: function () {
      return this.email; // Set username as email by default
    },
  },
  tokens: {
    type: Number,
    default: 100, // Default token value
  },
  loggedIn: {
    type: Boolean,
    default: false, // Default to not logged in
  },
  speechLanguage: {
    type: String,
    default: 'en', // Default to English
  },
  profilePictureURL: {
    type: String,
    default: 'https://avatars.githubusercontent.com/u/119653204?v=4', // Default profile picture
  },
});

// Create User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
