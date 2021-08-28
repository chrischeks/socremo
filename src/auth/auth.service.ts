import * as bcrypt from 'bcrypt';
import UniversalService from '@/@universal/service/universal.service';
import jwt from 'jsonwebtoken';
import customerModel from '@/customer/customer.model';
import { DataStoredInToken, ICreateAccount, ICreateCurrentAccount, ICreateEntity, IOpenPrivateClient, ISignIn, TokenData } from './auth.interface';
import { ICustomer } from '@/@universal/interfaces/customer.interface';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import config from 'config';
import entityModel from './entity.model';
import { CreateAccountDTO, CreateBasicEntityDTO, SignInDTO } from './auth.dto';
import randomatic from 'randomatic';
import otpModel from '@/otp/otp.model';
import { IOtp } from '@/otp/otp.interface';
import { OtpDTO } from '@/otp/otp.dto';
const { SOCREMO_BASE_URL, authorization } = config;

class AuthService extends UniversalService {
  private headers = { 'content-type': 'application/json' };
  public customer = customerModel;
  private entity = entityModel;
  private otp = otpModel;

  public processSendOTP = async (body: OtpDTO, metaData) => {
    const { primaryTelephone, firstName } = body;
    const otp: IOtp = await this.otp.findOne({ primaryTelephone }).lean();
    let code: number;
    let OTPCode: { code: number; expiresIn: number };
    if (!otp || Date.now() > otp.OTPCode.expiresIn) {
      code = randomatic('0', 4);
      OTPCode = { code, expiresIn: new Date().getTime() + 10 * 60000 };
    } else {
      OTPCode = otp.OTPCode;
    }

    const response = await this.processSendSMS(
      {
        mobileNumber: primaryTelephone,
        text: `Ola ${firstName || 'cliente'}, \nSeu código OTP chegou.\nCode: ${OTPCode.code} \nOTP expira em 10 minutos.
                \nEste OTP é privado e pessoal, não compartilhe ou envie para ninguém.`,
      },
      metaData,
    );
    const { status } = response;
    if (status === false) return this.failureResponse('OTP não foi enviado');
    await this.otp.updateOne({ primaryTelephone }, { OTPCode }, { upsert: true });
    return this.successResponse(`O código OTP foi enviado para ${primaryTelephone} e expirará em 10 minutos`);
  };

  public processValidateOTP = async body => {
    const { otp, primaryTelephone } = body;
    const savedMobile: IOtp = await this.otp.findOne({ primaryTelephone });
    if (!savedMobile) return this.failureResponse('Invalid code');
    const { expiresIn, code } = savedMobile.OTPCode;
    console.log(expiresIn, code, otp, code !== otp, Date.now() > expiresIn);

    if (code !== otp || Date.now() > expiresIn) return this.failureResponse('Code is invalid/expired');
    await this.otp.updateOne({ primaryTelephone }, { ref: randomatic('0', 10), 'OTPCode.code': null }, { new: true });
    return this.successResponse('Validated successfully');
  };

  public processCreateCustomer = async (customer: CreateCustomerDTO) => {
    let { pin, password, email, name } = customer;
    try {
      pin = await bcrypt.hash(pin, 10);
      password = await bcrypt.hash(password, 10);
      email = email.toLowerCase();
      const account = [{ accountType: 'mono-savings', accountNumber: await this.generateAccountNumber() }];
      const createUser: ICustomer = await this.customer.create({ pin, password, account, name, email });
      if (!createUser) return this.failureResponse('Signup failed');
      return this.successResponse(account[0]);
    } catch (error) {
      const { message } = error;
      if (message.includes('duplicate')) return this.failureResponse(`A customer with email ${email} already exist`);
    }
  };

  public processBasicRegistration = async (customer: CreateBasicEntityDTO) => {
    let {
      firstName,
      lastName,
      documentType1,
      documentNumber1,
      nuit,
      economicActivity,
      sex,
      birthdate,
      address1,
      description,
      location,
      documentImgUrl,
      sectorCode,
      issuingEntity1,
      issueDate1,
      expirationDate1,
      primaryIndicativeCode,
      primaryTelephone,
      pin,
      mPin,
    } = customer;

    try {
      pin = await bcrypt.hash(pin, 10);
      mPin = await bcrypt.hash(mPin, 10);
      const createUser: ICreateEntity = await this.entity.create({
        description,
        location,
        documentImgUrl,
        nuit,
        firstName,
        lastName,
        pin,
        mPin,
        birthdate,
        sectorCode,
        sex,
        economicActivity,
        documentType1,
        documentNumber1,
        issuingEntity1,
        issueDate1,
        expirationDate1,
        address1,
        primaryIndicativeCode,
        primaryTelephone,
        name: `${firstName} ${lastName}`,
      });
      if (!createUser) return this.failureResponse('Signup failed');
      return this.successResponse();
    } catch (error) {
      const { message } = error;
      if (message.includes('duplicate')) return this.failureResponse(`User already exist`);
    }
  };

  public processCreateEntity = async (body: CreateAccountDTO) => {
    const {
      name,
      birthdate,
      placeOfBirth,
      nationality,
      countryOfResidence,
      residenceCode,
      sectorCode,
      fathersName,
      mothersName,
      sex,
      maritalStatus,
      qualifications,
      numberOfChildren,
      numberOfHousehold,
      taxCategory,
      annualIncome,
      annualIncomeCurrency,
      currentMonthIncome,
      currentMonthIncomeCurrency,
      activity,
      profession,
      employer,
      functionOrPosition,
      admissionDate,
      economicActivity,
      documentType1,
      documentNumber1,
      issuingEntity1,
      countryCode1,
      issueDate1,
      expirationDate1,
      receiveEmail,
      address1,
      primaryIndicativeCode,
      primaryTelephone,
      receivesSMS,
    } = body;

    const payLoad = {
      entityType: 'P',
      name,
      birthdate,
      placeOfBirth,
      nationality,
      countryOfResidence,
      residenceCode,
      sectorCode,
      fathersName,
      mothersName,
      sex,
      maritalStatus,
      qualifications,
      numberOfChildren,
      numberOfHousehold,
      taxCategory,
      annualIncome,
      annualIncomeCurrency,
      currentMonthIncome,
      currentMonthIncomeCurrency,
      activity,
      profession,
      employer,
      functionOrPosition,
      admissionDate,
      economicActivity,
      documentType1,
      documentNumber1,
      issuingEntity1,
      countryCode1,
      issueDate1,
      expirationDate1,
      receiveEmail,
      address1,
      primaryIndicativeCode,
      primaryTelephone,
      receivesSMS,
      authorization,
    };

    // const builder = new xml2js.Builder();
    // const payLoad = builder.buildObject({
    //   'soap:Envelope': {
    //     $: this.soapNamespace(),
    //     'soap:Body': {
    //       openPrivateClient: {
    //         $: { xmlns: 'http://service.jbank.sysapp.com/' },
    //         openPrivateClientRequest: { $: { xmlns: '' }, ...(await this.addBaseXML(entity)) },
    //       },
    //     },
    //   },
    // });

    const endpoint = `${SOCREMO_BASE_URL}/client/private/open`;
    // const response = await this.centralAPICaller(endpoint, reqBody, { 'content-type': 'application/xml' }, 'post', true);
    const response = await this.makeSoapAPICall('entityInformation', 'entityInformationRequest', payLoad, endpoint, 'entityInformationResponse');
    const { errorCode, messages, entityNumber } = response;
    if (+errorCode[0] > 1) return this.failureResponse(messages[0]);

    // const parsedData = await xml2js.parseStringPromise(response);
    // const formatedRes = parsedData['soap:Envelope']['soap:Body'][0]['ns1:openPrivateEntityResponse'][0]['return'][0];
    // const { errorCode, messages, entityNumber } = formatedRes;
    // console.log(parsedData['soap:Envelope']['soap:Body'][0]['ns1:openPrivateEntityResponse'][0]['return'][0]);
    // if (+errorCode[0] > 1) return this.failureResponse(messages[0]);

    // password = await bcrypt.hash(password, 10);
    // pin = await bcrypt.hash(pin, 10);
    // await this.entity.create({ ...rest, pin, password });
    // return this.successResponse();
    return this.processCreateClient(entityNumber, body);
  };

  public processCreateClient = async (entityNumber: number, body: ICreateAccount) => {
    const {
      branchMovement,
      typeOfOwnership,
      correspondenceSending,
      conditionOfMovement,
      integratedExtract,
      residenceCode,
      sectorCode,
      clientSegment,
      clientCountryCode,
      address1,
    } = body;
    const payLoad = {
      branchMovement,
      typeOfOwnership,
      correspondenceSending,
      conditionOfMovement,
      integratedExtract,
      residenceCode,
      sectorCode,
      clientSegment,
      clientCountryCode,
      address1,
    };

    // const builder = new xml2js.Builder();
    // const reqBody = builder.buildObject({
    //   'soap:Envelope': {
    //     $: this.soapNamespace(),
    //     'soap:Body': {
    //       openPrivateClient: {
    //         $: { xmlns: 'http://service.jbank.sysapp.com/' },
    //         openPrivateClientRequest: { $: { xmlns: '' }, ...(await this.addBaseXML(body)) },
    //       },
    //     },
    //   },
    // });

    const endpoint = `${SOCREMO_BASE_URL}/credit_accounts/create`;
    const response = await this.makeSoapAPICall('entityInformation', 'entityInformationRequest', payLoad, endpoint, 'entityInformationResponse');
    const { errorCode, messages, clientNumber } = response;
    if (+errorCode[0] > 1) return this.failureResponse(messages[0]);
    // const response = await this.centralAPICaller(endpoint, reqBody, { 'content-type': 'application/xml' }, 'post', true);

    // const parsedData = await xml2js.parseStringPromise(response);
    // const formatedRes = parsedData['soap:Envelope']['soap:Body'][0]['ns1:openPrivateEntityResponse'][0]['return'][0];
    // const { errorCode, messages, clientNumber } = formatedRes;

    // if (+errorCode[0] > 1) return this.failureResponse(messages[0]);

    return this.processCreateCurrentAccount(clientNumber, body);
  };

  public processCreateCurrentAccount = async (clientNumber: number, body: ICreateAccount) => {
    let { branchMovement, productCode, componentCode, currency, withInterestRate, riskLevel, productSheet, mPin, pin } = body;
    const payLoad = {
      branchMovement,
      clientNumber,
      productCode,
      componentCode,
      currency,
      withInterestRate,
      riskLevel,
      productSheet,
    };

    // const builder = new xml2js.Builder();
    // const reqBody = builder.buildObject({
    //   'soap:Envelope': {
    //     $: this.soapNamespace(),
    //     'soap:Body': {
    //       currentAccountsCreate: {
    //         $: { xmlns: 'http://service.jbank.sysapp.com/' },
    //         currentAccountsCreateRequest: { $: { xmlns: '' }, ...(await this.addBaseXML(body)) },
    //       },
    //     },
    //   },
    // });

    const endpoint = `${SOCREMO_BASE_URL}/current_accounts/create`;
    const response = await this.makeSoapAPICall('entityInformation', 'entityInformationRequest', payLoad, endpoint, 'entityInformationResponse');
    const { errorCode, messages, currentAccountNumber } = response;
    if (+errorCode[0] > 1) return this.failureResponse(messages[0]);
    // const response = await this.centralAPICaller(endpoint, payLoad, { 'content-type': 'application/xml' }, 'post', true);

    // const parsedData = await xml2js.parseStringPromise(response);
    // const formatedRes = parsedData['soap:Envelope']['soap:Body'][0]['ns1:openPrivateEntityResponse'][0]['return'][0];

    // const { errorCode, messages, currentAccountNumber } = formatedRes;

    // if (+errorCode[0] > 1) return this.failureResponse(messages[0]);
    mPin = await bcrypt.hash(mPin, 10);
    pin = await bcrypt.hash(pin, 10);
    await this.entity.create({ ...body, pin, mPin, currentAccountNumber });
    return this.successResponse();
  };

  public processSignIn = async (customerData: SignInDTO) => {
    const { primaryTelephone, mPin } = customerData;

    const foundCustomer: ICreateEntity = await this.entity.findOne({ primaryTelephone }, { mPin: 1 });
    if (!foundCustomer) return this.failureResponse('Invalid phone or password.');
    const isPasswordMatching: boolean = await bcrypt.compare(mPin, foundCustomer.mPin);
    if (!isPasswordMatching) return this.failureResponse('Invalid phone or password.');
    const tokenData = await this.createToken(foundCustomer);
    await this.entity.updateOne({ primaryTelephone }, { auth: { accessToken: tokenData.token } });
    return this.successResponse({ tokenData });
  };

  public async createToken(customer: ICreateEntity): Promise<TokenData> {
    const dataStoredInToken: DataStoredInToken = { _id: customer._id };
    const secretKey: string = config.get('config.secretKey');
    const expiresIn: string = '1d';
    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
