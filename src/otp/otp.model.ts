import { Schema, model } from 'mongoose';
import { IOtp } from './otp.interface';

export const OTPSchema = new Schema(
  {
    primaryTelephone: String,
    OTPCode: {
      code: Number,
      expiresIn: Date,
    },
    ref: String,
  },
  { timestamps: true },
);

const otpModel = model<IOtp & Document>('otps', OTPSchema);

export default otpModel;
