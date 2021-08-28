import { Schema, model, Document } from 'mongoose';
import { ICreateEntity } from './auth.interface';
import {
  ProfessionalActivityEnum,
  DocumentTypeEnum,
  EconomicActivityEnum,
  MaritalStatusEnum,
  ProfessionEnum,
  QualificationsEnum,
  ReceiveEmailEnum,
  ReceiveSMSEnum,
  ResidenceCodeEnum,
  SectorCodeEnum,
  SexEnum,
  TaxCategoryEnum,
} from './entity.enums';

export const entitySchema: Schema = new Schema(
  {
    entityType: { type: String, default: 'P' },
    name: String,
    birthdate: Number,
    placeOfBirth: String,
    nationality: String,
    countryOfResidence: String,
    residenceCode: { type: String, enum: Object.values(ResidenceCodeEnum) },
    sectorCode: { type: String, enum: Object.values(SectorCodeEnum) },
    fathersName: String,
    mothersName: String,
    sex: { type: String, enum: Object.values(SexEnum) },
    maritalStatus: { type: String, enum: Object.values(MaritalStatusEnum) },
    qualifications: { type: String, enum: Object.values(QualificationsEnum) },
    numberOfChildren: Number,
    numberOfHousehold: Number,
    taxCategory: { type: String, enum: Object.values(TaxCategoryEnum) },
    annualIncome: Number,
    annualIncomeCurrency: String,
    currentMonthIncome: Number,
    currentMonthIncomeCurrency: String,
    activity: { type: String, enum: Object.values(ProfessionalActivityEnum) },
    profession: { type: String, enum: Object.values(ProfessionEnum) },
    employer: String,
    functionOrPosition: String,
    admissionDate: Number,
    economicActivity: { type: String, enum: Object.values(EconomicActivityEnum) },
    documentType1: { type: String, enum: Object.values(DocumentTypeEnum) },
    documentNumber1: String,
    issuingEntity1: String,
    countryCode1: String,
    issueDate1: Number,
    expirationDate1: Number,
    receiveEmail: { type: String, enum: Object.values(ReceiveEmailEnum) },
    address1: String,
    postalCodeOrCountry: String,
    primaryIndicativeCode: String,
    primaryTelephone: String,
    receivesSMS: { type: String, enum: Object.values(ReceiveSMSEnum) },
    mPin: String,
    pin: String,
    auth: {
      kind: {
        default: 'Bearer',
        type: String,
      },
      accessToken: String,
      passwordFailedCount: { type: Number, default: 0 },
      pinFailedCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const entityModel = model<ICreateEntity & Document>('entities', entitySchema);

export default entityModel;
