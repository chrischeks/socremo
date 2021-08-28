import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { ITransfer } from './payment.interface';

export class TransferDTO implements ITransfer {
  @IsNumber()
  amount: number;

  @IsString()
  @Length(4, 4)
  readonly pin: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  readonly debitAccount: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  readonly creditAccount: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  narration: string;
}
