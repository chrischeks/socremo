import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OtpDTO {
  @IsString()
  @IsNotEmpty()
  primaryTelephone: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNumber()
  otp: number;
}
