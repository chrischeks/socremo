import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import AuthRoute from '@/auth/auth.route';
import customerModel from '@/customer/customer.model';
import { TransferDTO } from '@/payment/payment.dto';
import PaymentRoute from '@/payment/payment.route';
const basePath = '/api';

let token1;
let token2;
let accountNumber;

const baseData1 = {
  email: 'john@gmail.com',
  password: 'q1w2e3r4!Q',
};
const baseData2 = {
  email: 'Jane@gmail.com',
  password: 'q1w2e3r4!Q',
};
const userData1: CreateCustomerDTO = {
  pin: '3245',
  name: 'John Doe',
  ...baseData1,
};
const userData2: CreateCustomerDTO = {
  pin: '3285',
  name: 'Jane Doe',
  ...baseData2,
};
const authRoute = new AuthRoute();
// (mongoose as any).connect = jest.fn();
const app = new App([authRoute]);
const appRequest = request(app.getServer());

beforeAll(async () => {
  await appRequest
    .post(`${basePath}${authRoute.authPath}/signUp`)
    .send(userData1)
    .then(result => {
      const { status, body } = result;
      expect(status).toBe(200);
      accountNumber = body.data.accountNumber;
    });

  await appRequest
    .post(`${basePath}${authRoute.authPath}/signIn`)
    .send(baseData1)
    .then(result => {
      const { tokenData } = result.body.data;
      token1 = tokenData.token;
    });

  await appRequest
    .post(`${basePath}${authRoute.authPath}/signUp`)
    .send(userData2)
    .then(result => {
      expect(result.status).toBe(200);
    });

  await appRequest
    .post(`${basePath}${authRoute.authPath}/signIn`)
    .send(baseData2)
    .then(result => {
      token2 = result.body.data.tokenData.token;
    });
});

afterAll(async () => {
  await customerModel.deleteMany();
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Payment', () => {
  const paymentRoute = new PaymentRoute();
  const userData: TransferDTO = {
    amount: 100,
    debitAccount: '3648763526',
    creditAccount: '4847378490',
    pin: userData1.pin,
    narration: 'test',
  };
  const customer = paymentRoute.paymentController.paymentService.customer;
  (mongoose as any).connect = jest.fn();
  const app = new App([paymentRoute]);
  describe('[POST] /payment/transfer', () => {
    it('should transfer to another account', async () => {
      customer.findOneAndUpdate = jest.fn().mockReturnValue({ account: [{ balance: 40000 }] });
      const { body, status } = await request(app.getServer())
        .post(`${basePath}${paymentRoute.path}/transfer`)
        .set('Authorization', `Bearer ${token1}`)
        .send(userData);
      const { status: _status, message } = body;
      expect(_status).toBe(true);
      expect(message).toBe('success');
    });
  });

  describe('[POST] /transactions/:accountNumber', () => {
    it('should return token for registered customers', async () => {
      //   const customerRoute = new CustomerRoute();
      const payment = paymentRoute.paymentController.paymentService.payment;
      const { amount, debitAccount, creditAccount, narration } = userData;
      payment.aggregate = jest.fn().mockReturnValue([
        {
          result: [
            {
              _id: '6111d2ade9c17745fd264946',
              charge: 0,
              amount,
              debitAccount,
              creditAccount,
              narration,
              createdAt: '2021-08-10T01:13:17.273Z',
              updatedAt: '2021-08-10T01:13:17.273Z',
              __v: 0,
              isDebit: true,
            },
          ],
          total: 1,
        },
      ]);

      (mongoose as any).connect = jest.fn();

      const app = new App([paymentRoute]);
      const { body, status } = await request(app.getServer())
        .get(`${basePath}${paymentRoute.path}/transactions/${accountNumber}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(status).toBe(200);
      expect(body.data[0].result).toBeDefined();
      expect(body.data[0].total).toBe(1);
    });
  });
});
