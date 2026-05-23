import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function requiredPassword() {
        return this.authProvider === 'local';
      },
      minlength: 6,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'deliveryBoy'],
      default: 'user',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetOtp: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
