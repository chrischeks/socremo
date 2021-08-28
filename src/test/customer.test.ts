import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import AuthRoute from '@/auth/auth.route';
import { AccountOpenDTO } from '@/customer/customer.dto';
import { AccountTypes } from '@/customer/customer.enum';
import CustomerRoute from '@/customer/customer.route';
import customerModel from '@/customer/customer.model';
const basePath = '/api';

let token;
const baseData = {
  email: 'test@gmail.com',
  password: 'q1w2e3r4!Q',
};
const userData: CreateCustomerDTO = {
  ...baseData,
  pin: '3245',
  name: 'John Doe',
};
const authRoute = new AuthRoute();
// (mongoose as any).connect = jest.fn();
const app = new App([authRoute]);
const appRequest = request(app.getServer());

beforeAll(async () => {
  await appRequest
    .post(`${basePath}${authRoute.authPath}/signUp`)
    .send(userData)
    .then(result => {
      expect(result.status).toBe(200);
    });

  await appRequest
    .post(`${basePath}${authRoute.authPath}/signIn`)
    .send(baseData)
    .then(result => {
      token = result.body.data.tokenData.token;
    });
});

afterAll(async () => {
  await customerModel.deleteMany();
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Customer', () => {
  let accountNumber;
  const customerRoute = new CustomerRoute();
  const customer = customerRoute.customerController.customerService.customer;
  (mongoose as any).connect = jest.fn();
  const app = new App([customerRoute]);
  describe('[POST] /account/open-account', () => {
    it('should open a new account for an existing customer', async () => {
      const userData: AccountOpenDTO = {
        accountType: AccountTypes.monoCurrent,
      };

      customer.updateOne = jest.fn().mockReturnValue({ nModified: 1 });
      const { body, status } = await request(app.getServer())
        .post(`${basePath}${customerRoute.path}/account/open-account`)
        .set('Authorization', `Bearer ${token}`)
        .send(userData);
      expect(status).toBe(200);
      const { status: _status, data } = body;
      expect(_status).toBe(true);
      expect(data.accountNumber).toBeDefined();
      expect(data.accountType).toEqual(AccountTypes.monoCurrent);
      accountNumber = data.accountNumber;
    });
  });

  describe('[GET] /name-enquiry/:accountNumber', () => {
    it('should return name of customer', async () => {
      customer.findOne = jest.fn().mockReturnValue({
        name: userData.name,
      });

      const app = new App([customerRoute]);
      const { body, status } = await request(app.getServer())
        .get(`${basePath}${customerRoute.path}/name-enquiry/${accountNumber}`)
        .set('Authorization', `Bearer ${token}`);
      expect(status).toBe(200);
      expect(body.data.customerName).toEqual(userData.name);
    });
  });
});
