import IResponse from '@/@universal/interfaces/response.interface';
import UniversalService from '@/@universal/service/universal.service';
import { ITransfer } from './payment.interface';
import mongoose from 'mongoose';
import customerModel from '@/customer/customer.model';
import paymentModel from './payment.model';
import { ICustomer } from '@/@universal/interfaces/customer.interface';
import bcrypt from 'bcrypt';

class PaymentService extends UniversalService {
  public customer = customerModel;
  public payment = paymentModel;

  public processLocalTransfer = async (customer: ICustomer, body) => {
    const { debitAccount, creditAccount, narration = `Mono fund transfer`, amount, pin: xpin } = body as ITransfer;
    let { email, pin } = customer;
    const validPin = await bcrypt.compare(xpin, pin);
    if (!validPin) return this.failureResponse('Pin mismatch');
    email = email.toLowerCase();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const opts = { session, new: true, projection: { account: { $elemMatch: { accountNumber: debitAccount } }, _id: 0 } };
      const senderAccount = await this.customer.findOneAndUpdate(
        { email, 'account.accountNumber': debitAccount },
        { $inc: { 'account.$.balance': -(amount * 100) } },
        opts,
      );
      if (!senderAccount || senderAccount.account.length < 1) return this.failureResponse('Invalid debit account');
      if (senderAccount.account[0].balance < 0) {
        session.abortTransaction();
        return this.failureResponse('Insufficient balance');
      }

      const receiverAccount = await this.customer.findOneAndUpdate(
        { 'account.accountNumber': creditAccount },
        { $inc: { 'account.$.balance': amount * 100 } },
        opts,
      );
      if (!receiverAccount) {
        session.abortTransaction();
        return this.failureResponse('Invalid credit account');
      }
      const payment = new this.payment({ amount, debitAccount, creditAccount, narration });
      await payment.save({ session });
      await session.commitTransaction();
      session.endSession();
      return this.successResponse();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Transaction failed');
    }
  };

  public processTransactionHistory = async (customer: ICustomer, accountNumber, query) => {
    let { account } = customer;
    const customerAccount = account.find(acc => acc.accountNumber === accountNumber);
    if (!customerAccount) return this.failureResponse('Operation not allowed');
    let { limit, page } = query;
    limit = Number(limit) || 10;
    page = page <= 0 ? 0 : Number(page - 1);
    const transactions = await this.payment.aggregate([
      { $match: { $or: [{ creditAccount: accountNumber }, { debitAccount: accountNumber }] } },
      { $addFields: { isDebit: { $cond: { if: { $eq: ['$debitAccount', accountNumber] }, then: true, else: false } } } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          result: [{ $sort: { createdAt: -1 } }, { $skip: page }, { $limit: limit }],
        },
      },
      {
        $project: {
          result: 1,
          // Get total from the first element of the metadata array
          total: { $arrayElemAt: ['$metadata.total', 0] },
        },
      },
    ]);
    return this.successResponse(transactions);
  };
}

export default PaymentService;
