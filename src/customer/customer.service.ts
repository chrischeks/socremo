import { ICustomer } from '@/@universal/interfaces/customer.interface';
import UniversalService from '@/@universal/service/universal.service';
import customerModel from './customer.model';
import entityModel from '@/auth/entity.model';
import config from 'config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ICreateAccount, ICreateEntity } from '@/auth/auth.interface';
import credentialHistoryModel from './credentials.model';
import { ChangeMPinDTO } from './customer.dto';

const { SOCREMO_BASE_URL } = config;

class CustomerService extends UniversalService {
  public customer = customerModel;
  private entity = entityModel;
  private credentialHistory = credentialHistoryModel;

  protected credentialPolicy = async (_id, credential: string, credType: string) => {
    const credHistory = await this.credentialHistory.findById({ _id });
    for (const history of credHistory.credentialHistory) {
      if (history[credType]) {
        if (await bcrypt.compare(credential, history[credType])) {
          return this.failureResponse(`You have used this ${credType} before, kindly try another ${credType}`);
        }
      }
    }
    return this.successResponse();
  };

  public processChangeMpin = async (user: ICreateAccount, body: ChangeMPinDTO) => {
    const { oldMpin, newMpin } = body;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { _id: userId, mPin } = user;
      const _id = Types.ObjectId(userId);
      const isValid = await bcrypt.compare(oldMpin, mPin);
      if (!isValid) return this.failureResponse('Incorrect mPin');

      const policyPassed = await this.credentialPolicy(_id, newMpin, 'mPin');
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      const encryptedNewMpin = await bcrypt.hash(newMpin, 10);
      await this.entity.updateOne({ _id }, { $set: { mPin: encryptedNewMpin } }, { session });
      await this.credentialHistory.updateOne({ _id }, { $push: { credentialHistory: { mPin: encryptedNewMpin } } }, { session });
      await session.commitTransaction();
      session.endSession();
      return this.successResponse();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }
  };

  // public processAccountOpening = async (customer: ICustomer, body: AccountOpenDTO) => {
  //   let { email, account } = customer;
  //   const { accountType } = body;
  //   const found = account.find(acc => acc.accountType === accountType);
  //   if (found) return this.failureResponse(`You already have a ${accountType} account`);
  //   const newAccount = { accountNumber: await this.generateAccountNumber(), accountType };
  //   const createAccount = await this.customer.updateOne({ email }, { $push: { account: newAccount } });
  //   if (createAccount.nModified === 0) return this.failureResponse('Account opening failed');
  //   return this.successResponse(newAccount);
  // };

  public processGetCustomerByAccountNumber = async (accountNumber: string) => {
    const customer = await this.customer.findOne({ 'account.accountNumber': accountNumber }, { name: 1, _id: 0 });
    if (!customer) return this.failureResponse('Invalid account number');
    return this.successResponse({ customerName: customer.name });
  };

  public processOnboardExistingCustomer = async body => {
    const { nuit, primaryTelephone: phonNumber, password, pin } = body;
    const payLoad = {
      nuit,
      phonNumber,
    };
    const endpoint = `${SOCREMO_BASE_URL}/entity/information`;
    const response = await this.makeSoapAPICall('entityInformation', 'entityInformationRequest', payLoad, endpoint, 'entityInformationResponse');
    const { errorCode, messages, ...rest } = response;
    if (+errorCode[0] > 1) return this.failureResponse(messages[0]);
    await this.entity.create({ ...rest, pin, password });
    return this.successResponse(rest);
  };
}

export default CustomerService;
