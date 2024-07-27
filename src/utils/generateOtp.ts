import crypto from 'crypto';


const otpSecret = process.env.OTP_SECRET || 'your_otp_secret';

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOTP = (otp: string): string => {
  return crypto.createHmac('sha256', otpSecret).update(otp).digest('hex');
};

