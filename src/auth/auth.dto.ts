import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, Length, Matches, NotEquals, ValidateNested } from 'class-validator';
import { ICreateAccount, ICreateBasicEntity, ICreateEntity, IListOfEntityEntry, ILocation, ISignIn } from './auth.interface';
import {
  ProfessionalActivityEnum,
  BranchMovementEnum,
  ClientSegmentEnum,
  ComponentCodeEnum,
  ConditionOfMovementEnum,
  CorrespondenceSendingEnum,
  DocumentTypeEnum,
  EconomicActivityEnum,
  IntegratedExtractEnum,
  MaritalStatusEnum,
  ProductCodeEnum,
  ProductSheetEnum,
  ProfessionEnum,
  QualificationsEnum,
  ReceiveEmailEnum,
  ReceiveSMSEnum,
  ResidenceCodeEnum,
  RiskLevelEnum,
  SectorCodeEnum,
  SexEnum,
  TaxCategoryEnum,
  TypeOfOwnershipEnum,
  WithInterestRateEnum,
} from './entity.enums';

export class LocationDTO implements ILocation {
  @IsNumber()
  readonly longitude: number;

  @IsNumber()
  readonly latitude: number;
}

export class CreateBasicEntityDTO implements ICreateBasicEntity {
  @IsString()
  @IsNotEmpty({ message: 'mPin is required' })
  @Length(4, 4, { message: 'mPin should be 4 digits' })
  readonly mPin: string;

  @IsString()
  @IsNotEmpty({ message: 'lastName is required' })
  readonly lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'nuit is required' })
  readonly nuit: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  readonly description: string;

  @IsString()
  @IsNotEmpty({ message: 'documentImgUrl is required' })
  readonly documentImgUrl: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDTO)
  location: LocationDTO;

  @IsString()
  @IsNotEmpty({ message: 'firstName is required' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'pin is required' })
  @Length(4, 4, { message: 'password should be 4 characters long' })
  readonly pin: string;

  @IsString()
  @IsNotEmpty({ message: 'address1 is required' })
  readonly address1: string;

  @IsNumber()
  @IsNotEmpty({ message: 'birthDate is required' })
  readonly birthdate: number;

  @IsEnum(DocumentTypeEnum, { message: `documentType1 should be any of ${Object.values(DocumentTypeEnum)}` })
  readonly documentType1: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'documentNumber1 is required' })
  readonly documentNumber1: string;

  @IsEnum(SectorCodeEnum, { message: `sectorCode should be any of ${Object.values(SectorCodeEnum)}` })
  readonly sectorCode: SectorCodeEnum;

  @IsEnum(SexEnum, { message: `sex should be any of ${Object.values(SexEnum)}` })
  readonly sex: SexEnum;

  @IsOptional()
  @IsEnum(EconomicActivityEnum, { message: `economicActivity should be any of ${Object.values(EconomicActivityEnum)}` })
  readonly economicActivity: EconomicActivityEnum;

  @IsString()
  readonly issuingEntity1: string;

  @IsNumber()
  readonly issueDate1: number;

  @IsOptional()
  @IsNumber()
  readonly expirationDate1: number;

  @IsOptional()
  @IsString()
  @Length(2, 3, { message: 'primaryIndicativeCode should not be between 2 and 3 characters long' })
  readonly primaryIndicativeCode: string;

  @IsOptional()
  @IsString()
  readonly primaryTelephone: string;
}

// export class CreateEntityDTO implements ICreateEntity {
//   @IsString()
//   @IsNotEmpty({ message: 'password is required' })
//   @Length(6, 100, { message: 'password should be between 6 and 100 digits' })
//   readonly password: string;

//   @IsEnum(EntityTypeEnum, { message: `entityType should be any of ${Object.values(EntityTypeEnum)}` })
//   entityType: EntityTypeEnum;

//   @IsString()
//   @IsNotEmpty({ message: 'name is required' })
//   name: string;

//   @IsString()
//   @IsNotEmpty({ message: 'pin is required' })
//   @Length(4, 4, { message: 'password should be 4 characters long' })
//   pin: string;

//   @IsEnum(ReceiveSMSEnum, { message: `receivesSMS should be any of ${Object.values(ReceiveSMSEnum)}` })
//   receivesSMS: ReceiveSMSEnum;

//   @IsString()
//   @IsNotEmpty({ message: 'address1 is required' })
//   address1: string;

//   @IsString()
//   @IsNotEmpty({ message: 'documentNumber1 is required' })
//   documentNumber1: string;

//   @IsOptional()
//   authorization: number;

//   @IsOptional()
//   accessToken: number;

//   @IsString()
//   @IsNotEmpty({ message: 'birthDate is required' })
//   birthdate: number;

//   @IsEnum(DocumentTypeEnum, { message: `documentType1 should be any of ${Object.values(DocumentTypeEnum)}` })
//   documentType1: DocumentTypeEnum;

//   @IsString()
//   @IsNotEmpty({ message: 'birthDate is required' })
//   placeOfBirth;

//   @IsEnum(ProfessionEnum, { message: `profession should be any of ${Object.values(ProfessionEnum)}` })
//   profession: ProfessionEnum;

//   @IsString()
//   @IsNotEmpty({ message: 'nationality is required' })
//   @Length(2, 3, { message: 'nationality should not be between 2 and 3 characters long' })
//   nationality: string;

//   @IsString()
//   @IsNotEmpty({ message: 'countryOfResidence is required' })
//   @Length(2, 3, { message: 'countryOfResidence should not be between 2 and 3 characters long' })
//   countryOfResidence: string;

//   @IsEnum(ResidenceCodeEnum, { message: `residenceCode should be any of ${Object.values(ResidenceCodeEnum)}` })
//   residenceCode: ResidenceCodeEnum;

//   @IsEnum(SectorCodeEnum, { message: `sectorCode should be any of ${Object.values(SectorCodeEnum)}` })
//   sectorCode: SectorCodeEnum;

//   @IsString()
//   @IsNotEmpty({ message: 'fathersName is required' })
//   fathersName: string;

//   @IsString()
//   @IsNotEmpty({ message: 'mothersName is required' })
//   mothersName: string;

//   @IsEnum(SexEnum, { message: `sex should be any of ${Object.values(SexEnum)}` })
//   sex: SexEnum;

//   @IsEnum(MaritalStatusEnum, { message: `maritalStatus should be any of ${Object.values(MaritalStatusEnum)}` })
//   maritalStatus: MaritalStatusEnum;

//   @IsEnum(QualificationsEnum, { message: `qualifications should be any of ${Object.values(QualificationsEnum)}` })
//   qualifications: QualificationsEnum;

//   @IsEnum(TaxCategoryEnum, { message: `taxCategory should be any of ${Object.values(TaxCategoryEnum)}` })
//   taxCategory: TaxCategoryEnum;

//   @IsEnum(ActivityEnum, { message: `activity should be any of ${Object.values(ActivityEnum)}` })
//   activity: ActivityEnum;

//   @IsOptional()
//   @IsNumber()
//   numberOfChildren: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfHousehold: number;

//   @IsOptional()
//   @IsNumber()
//   annualIncome: number;

//   @IsOptional()
//   @IsString()
//   @Length(2, 3, { message: 'annualIncomeCurrency should not be between 2 and 3 characters long' })
//   annualIncomeCurrency: string;

//   @IsOptional()
//   @IsNumber()
//   currentMonthIncome: number;

//   @IsOptional()
//   @IsString()
//   @Length(2, 3, { message: 'currentMonthIncomeCurrency should not be between 2 and 3 characters long' })
//   currentMonthIncomeCurrency?: string;

//   @IsOptional()
//   @IsString()
//   employer: string;

//   @IsOptional()
//   @IsString()
//   functionOrPosition: string;

//   @IsOptional()
//   @IsNumber()
//   admissionDate?: number;

//   @IsOptional()
//   @IsEnum(EconomicActivityEnum, { message: `economicActivity should be any of ${Object.values(EconomicActivityEnum)}` })
//   economicActivity: EconomicActivityEnum;

//   @IsOptional()
//   @IsString()
//   issuingEntity1: string;

//   @IsOptional()
//   @IsString()
//   countryCode1: string;

//   @IsOptional()
//   @IsNumber()
//   issueDate1: number;

//   @IsOptional()
//   @IsNumber()
//   expirationDate1: number;

//   @IsOptional()
//   @IsEnum(ReceiveEmailEnum, { message: `receiveEmail should be any of ${Object.values(ReceiveEmailEnum)}` })
//   receiveEmail: ReceiveEmailEnum;

//   @IsOptional()
//   @IsString()
//   @Length(2, 7, { message: 'postalCodeOrCountry should not be between 2 and 7 characters long' })
//   postalCodeOrCountry: string;

//   @IsOptional()
//   @IsString()
//   @Length(2, 3, { message: 'primaryIndicativeCode should not be between 2 and 3 characters long' })
//   primaryIndicativeCode: string;

//   @IsOptional()
//   @IsString()
//   primaryTelephone: string;
// }

class ListOfEntityEntryDTO implements IListOfEntityEntry {
  @IsNumber()
  entityNumber: number;

  @IsString()
  relationWithClient: string;

  @IsOptional()
  @IsString()
  relationWithFirstEntity?: string;
}

export class CreateAccountDTO implements ICreateAccount {
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @Length(6, 100, { message: 'password should be between 6 and 100 digits' })
  readonly mPin: string;

  // @IsEnum(EntityTypeEnum, { message: `entityType should be any of ${Object.values(EntityTypeEnum)}` })
  // entityType: EntityTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'pin is required' })
  @Length(4, 4, { message: 'password should be 4 characters long' })
  pin: string;

  @IsEnum(ReceiveSMSEnum, { message: `receivesSMS should be any of ${Object.values(ReceiveSMSEnum)}` })
  receivesSMS: ReceiveSMSEnum;

  @IsString()
  @IsNotEmpty({ message: 'address1 is required' })
  address1: string;

  @IsString()
  @IsNotEmpty({ message: 'documentNumber1 is required' })
  documentNumber1: string;

  @IsOptional()
  authorization: number;

  @IsOptional()
  accessToken: number;

  @IsString()
  @IsNotEmpty({ message: 'birthDate is required' })
  birthdate: number;

  @IsEnum(DocumentTypeEnum, { message: `documentType1 should be any of ${Object.values(DocumentTypeEnum)}` })
  documentType1: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'birthDate is required' })
  placeOfBirth;

  @IsEnum(ProfessionEnum, { message: `profession should be any of ${Object.values(ProfessionEnum)}` })
  profession: ProfessionEnum;

  @IsString()
  @IsNotEmpty({ message: 'nationality is required' })
  @Length(2, 3, { message: 'nationality should not be between 2 and 3 characters long' })
  nationality: string;

  @IsString()
  @IsNotEmpty({ message: 'countryOfResidence is required' })
  @Length(2, 3, { message: 'countryOfResidence should not be between 2 and 3 characters long' })
  countryOfResidence: string;

  @IsEnum(ResidenceCodeEnum, { message: `residenceCode should be any of ${Object.values(ResidenceCodeEnum)}` })
  residenceCode: ResidenceCodeEnum;

  @IsEnum(SectorCodeEnum, { message: `sectorCode should be any of ${Object.values(SectorCodeEnum)}` })
  sectorCode: SectorCodeEnum;

  @IsString()
  @IsNotEmpty({ message: 'fathersName is required' })
  fathersName: string;

  @IsString()
  @IsNotEmpty({ message: 'mothersName is required' })
  mothersName: string;

  @IsEnum(SexEnum, { message: `sex should be any of ${Object.values(SexEnum)}` })
  sex: SexEnum;

  @IsEnum(MaritalStatusEnum, { message: `maritalStatus should be any of ${Object.values(MaritalStatusEnum)}` })
  maritalStatus: MaritalStatusEnum;

  @IsEnum(QualificationsEnum, { message: `qualifications should be any of ${Object.values(QualificationsEnum)}` })
  qualifications: QualificationsEnum;

  @IsEnum(TaxCategoryEnum, { message: `taxCategory should be any of ${Object.values(TaxCategoryEnum)}` })
  taxCategory: TaxCategoryEnum;

  @IsEnum(ProfessionalActivityEnum, { message: `activity should be any of ${Object.values(ProfessionalActivityEnum)}` })
  activity: ProfessionalActivityEnum;

  @IsOptional()
  @IsNumber()
  numberOfChildren: number;

  @IsOptional()
  @IsNumber()
  numberOfHousehold: number;

  @IsOptional()
  @IsNumber()
  annualIncome: number;

  @IsOptional()
  @IsString()
  @Length(2, 3, { message: 'annualIncomeCurrency should not be between 2 and 3 characters long' })
  annualIncomeCurrency: string;

  @IsOptional()
  @IsNumber()
  currentMonthIncome: number;

  @IsOptional()
  @IsString()
  @Length(2, 3, { message: 'currentMonthIncomeCurrency should not be between 2 and 3 characters long' })
  currentMonthIncomeCurrency?: string;

  @IsOptional()
  @IsString()
  employer: string;

  @IsOptional()
  @IsString()
  functionOrPosition: string;

  @IsOptional()
  @IsNumber()
  admissionDate?: number;

  @IsOptional()
  @IsEnum(EconomicActivityEnum, { message: `economicActivity should be any of ${Object.values(EconomicActivityEnum)}` })
  economicActivity: EconomicActivityEnum;

  @IsOptional()
  @IsString()
  issuingEntity1: string;

  @IsOptional()
  @IsString()
  countryCode1: string;

  @IsOptional()
  @IsNumber()
  issueDate1: number;

  @IsOptional()
  @IsNumber()
  expirationDate1: number;

  @IsOptional()
  @IsEnum(ReceiveEmailEnum, { message: `receiveEmail should be any of ${Object.values(ReceiveEmailEnum)}` })
  receiveEmail: ReceiveEmailEnum;

  // @IsOptional()
  // @IsString()
  // @Length(2, 7, { message: 'postalCodeOrCountry should not be between 2 and 7 characters long' })
  // postalCodeOrCountry: string;

  @IsOptional()
  @IsString()
  @Length(2, 3, { message: 'primaryIndicativeCode should not be between 2 and 3 characters long' })
  primaryIndicativeCode: string;

  @IsOptional()
  @IsString()
  primaryTelephone: string;

  @IsEnum(BranchMovementEnum, { message: `branchMovement should be any of ${Object.values(BranchMovementEnum)}` })
  branchMovement: BranchMovementEnum;

  // @IsNotEmptyObject()
  // @ValidateNested()
  // @Type(() => ListOfEntityEntryDTO)
  // listOfEntityEntry: ListOfEntityEntryDTO;

  @IsEnum(TypeOfOwnershipEnum, { message: `typeOfOwnership should be any of ${Object.values(TypeOfOwnershipEnum)}` })
  typeOfOwnership: TypeOfOwnershipEnum;

  @IsEnum(CorrespondenceSendingEnum, { message: `correspondenceSending should be any of ${Object.values(CorrespondenceSendingEnum)}` })
  correspondenceSending: CorrespondenceSendingEnum;

  @IsEnum(ConditionOfMovementEnum, { message: `conditionOfMovement should be any of ${Object.values(ConditionOfMovementEnum)}` })
  conditionOfMovement: ConditionOfMovementEnum;

  @IsEnum(IntegratedExtractEnum, { message: `integratedExtract should be any of ${Object.values(IntegratedExtractEnum)}` })
  integratedExtract: IntegratedExtractEnum;

  @IsEnum(ClientSegmentEnum, { message: `clientSegment should be any of ${Object.values(ClientSegmentEnum)}` })
  clientSegment: ClientSegmentEnum;

  @IsString()
  @IsNotEmpty({ message: 'clientCountryCode is required' })
  clientCountryCode: string;

  @IsEnum(ProductCodeEnum, { message: `productCode should be any of ${Object.values(ProductCodeEnum)}` })
  productCode: ProductCodeEnum;

  @IsEnum(ComponentCodeEnum, { message: `componentCode should be any of ${Object.values(ComponentCodeEnum)}` })
  componentCode: ComponentCodeEnum;

  @IsString()
  @IsNotEmpty({ message: 'currency is required' })
  @Length(2, 3, { message: 'currency should not be between 2 and 3 characters long' })
  currency: string;

  @IsEnum(WithInterestRateEnum, { message: `withInterestRate should be any of ${Object.values(WithInterestRateEnum)}` })
  withInterestRate: WithInterestRateEnum;

  @IsEnum(RiskLevelEnum, { message: `riskLevel should be any of ${Object.values(RiskLevelEnum)}` })
  riskLevel: RiskLevelEnum;

  @IsEnum(ProductSheetEnum, { message: `productSheet should be any of ${Object.values(ProductSheetEnum)}` })
  productSheet: ProductSheetEnum;
}

export class SignInDTO implements ISignIn {
  @IsString()
  @IsNotEmpty()
  primaryTelephone: string;

  @IsString()
  @IsNotEmpty()
  mPin: string;
}
