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

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface ICreateEntity {
  // entityType: EntityTypeEnum;
  _id?: string;
  name: string;
  birthdate: number;
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  residenceCode: ResidenceCodeEnum;
  sectorCode: SectorCodeEnum;
  fathersName: string;
  mothersName: string;
  sex: SexEnum;
  maritalStatus: MaritalStatusEnum;
  qualifications: QualificationsEnum;
  numberOfChildren?: Number;
  numberOfHousehold?: number;
  taxCategory: TaxCategoryEnum;
  annualIncome?: number;
  annualIncomeCurrency?: string;
  currentMonthIncome?: number;
  currentMonthIncomeCurrency?: string;
  activity: ProfessionalActivityEnum;
  profession: ProfessionEnum;
  employer?: string;
  functionOrPosition?: string;
  admissionDate?: number;
  economicActivity?: EconomicActivityEnum;
  documentType1: DocumentTypeEnum;
  documentNumber1: string;
  issuingEntity1?: string;
  countryCode1?: string;
  issueDate1?: number;
  expirationDate1?: number;
  receiveEmail?: ReceiveEmailEnum;
  address1: string;
  postalCodeOrCountry?: string;
  primaryIndicativeCode?: string;
  primaryTelephone?: string;
  receivesSMS: ReceiveSMSEnum;
  mPin: string;
  pin: string;
  auth?: {
    kind?: {
      type: string;
    };
    accessToken?: string;
    passwordFailedCount?: number;
    pinFailedCount?: number;
  };
}

export interface ICreateAccount {
  // entityType: EntityTypeEnum;
  _id?: string;
  name: string;
  birthdate: number;
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  residenceCode: ResidenceCodeEnum;
  sectorCode: SectorCodeEnum;
  fathersName: string;
  mothersName: string;
  sex: SexEnum;
  maritalStatus: MaritalStatusEnum;
  qualifications: QualificationsEnum;
  numberOfChildren?: Number;
  numberOfHousehold?: number;
  taxCategory: TaxCategoryEnum;
  annualIncome?: number;
  annualIncomeCurrency?: string;
  currentMonthIncome?: number;
  currentMonthIncomeCurrency?: string;
  activity: ProfessionalActivityEnum;
  profession: ProfessionEnum;
  employer?: string;
  functionOrPosition?: string;
  admissionDate?: number;
  economicActivity?: EconomicActivityEnum;
  documentType1: DocumentTypeEnum;
  documentNumber1: string;
  issuingEntity1?: string;
  countryCode1?: string;
  issueDate1?: number;
  expirationDate1?: number;
  receiveEmail?: ReceiveEmailEnum;
  postalCodeOrCountry?: string;
  primaryIndicativeCode?: string;
  primaryTelephone?: string;
  receivesSMS: ReceiveSMSEnum;
  mPin: string;
  pin: string;
  branchMovement: BranchMovementEnum;
  // listOfEntityEntry: IListOfEntityEntry;
  typeOfOwnership: TypeOfOwnershipEnum;
  correspondenceSending: CorrespondenceSendingEnum;
  conditionOfMovement: ConditionOfMovementEnum;
  integratedExtract: IntegratedExtractEnum;
  clientSegment: ClientSegmentEnum;
  clientCountryCode: string;
  address1: string;
  productCode: ProductCodeEnum;
  componentCode: ComponentCodeEnum;
  currency: string;
  withInterestRate: WithInterestRateEnum;
  riskLevel: RiskLevelEnum;
  productSheet: ProductSheetEnum;
}

export interface IListOfEntityEntry {
  entityNumber: number;
  relationWithClient: string;
  relationWithFirstEntity?: string;
}

export interface IOpenPrivateClient {
  branchMovement: BranchMovementEnum;
  listOfEntityEntry: IListOfEntityEntry;
  typeOfOwnership: TypeOfOwnershipEnum;
  correspondenceSending: CorrespondenceSendingEnum;
  conditionOfMovement: ConditionOfMovementEnum;
  integratedExtract: IntegratedExtractEnum;
  residenceCode: ResidenceCodeEnum;
  sectorCode: SectorCodeEnum;
  clientSegment: ClientSegmentEnum;
  clientCountryCode: string;
  address1: string;
}

export interface ICreateCurrentAccount {
  branchMovement: BranchMovementEnum;
  clientNumber: number;
  productCode: ProductCodeEnum;
  componentCode: ComponentCodeEnum;
  currency: string;
  withInterestRate: WithInterestRateEnum;
  riskLevel: RiskLevelEnum;
  productSheet: ProductSheetEnum;
}

export interface ISignIn {
  primaryTelephone: string;
  mPin: string;
}

export interface ILocation {
  longitude: number;
  latitude: number;
}

export interface ICreateBasicEntity {
  _id?: string;
  firstName: string;
  lastName: string;
  nuit: string;
  location: ILocation;
  birthdate: number;
  sectorCode: SectorCodeEnum;
  sex: SexEnum;
  economicActivity?: EconomicActivityEnum;
  documentType1: DocumentTypeEnum;
  documentNumber1: string;
  issuingEntity1?: string;
  issueDate1?: number;
  expirationDate1?: number;
  address1: string;
  primaryIndicativeCode?: string;
  primaryTelephone?: string;
  mPin: string;
  pin: string;
  description: string;
  documentImgUrl: string;
}
