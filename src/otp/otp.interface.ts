export interface IOtp {
  primaryTelephone: string;
  OTPCode: {
    code: number;
    expiresIn: number;
  };
  ref: string;
}
