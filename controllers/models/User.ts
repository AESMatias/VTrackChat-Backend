import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionPlan {
  Normal = 0,
  Premium = 1,
  PremiumPlus = 2,
}

export enum SpeechRecordingStatus {
  Inactive = 0,
  Recording = 1,
  Error = 2,
}

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  currentPlan: SubscriptionPlan;
  tokens: number;
  loggedIn: boolean;
  speechRecordingStatus: SpeechRecordingStatus;
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
  currentPlan: {
    type: Number,
    enum: Object.values(SubscriptionPlan),
    default: SubscriptionPlan.Normal, // Default to Normal plan
  },
  tokens: {
    type: Number,
    default: 100, // Default token value
  },
  loggedIn: {
    type: Boolean,
    default: false, // Default to not logged in
  },
  speechRecordingStatus: {
    type: Number,
    enum: Object.values(SpeechRecordingStatus),
    default: SpeechRecordingStatus.Inactive, // Default to Inactive
  },
});

// Create User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
