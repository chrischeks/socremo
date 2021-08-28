import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AccountNumberDTO {
  @IsString()
  @IsNotEmpty({ message: 'accountNumber is required' })
  @Length(10, 10)
  readonly accountNumber: string;
}
