import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IEntityInformation } from './customer.interface';

export class EntityInformationDTO implements IEntityInformation {
  @IsString()
  @IsNotEmpty({ message: 'nuit is required' })
  readonly nuit: string;

  @IsString()
  @IsNotEmpty({ message: 'primaryTelephone is required' })
  readonly primaryTelephone: string;

  @IsString()
  @IsNotEmpty({ message: 'pin is required' })
  @Length(4, 4, { message: 'password should be 4 characters long' })
  readonly pin: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @Length(6, 100, { message: 'password should be between 6 and 100 digits' })
  readonly password: string;
}

export class ChangeMPinDTO {
  @IsString()
  @IsNotEmpty({ message: 'newMpin is required' })
  readonly newMpin: string;

  @IsString()
  @IsNotEmpty({ message: 'oldMpin is required' })
  readonly oldMpin: string;
}
