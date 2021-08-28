import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ICustomer } from '../interfaces/customer.interface';

export class CreateCustomerDTO implements ICustomer {
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/, {
    message:
      'Enter a password at least 8 characters long with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
  })
  password: string;

  @IsString()
  @Length(4, 4)
  pin: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;
}
