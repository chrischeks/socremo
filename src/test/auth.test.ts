import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import AuthRoute from '@/auth/auth.route';
const basePath = '/api';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  const baseData = {
    email: 'test@gmail.com',
    password: 'q1w2e3r4!Q',
  };
  describe('[POST] /signup', () => {
    it('should create a customer', async () => {
      const userData: CreateCustomerDTO = {
        ...baseData,
        pin: '3245',
        name: 'John Doe',
      };

      const authRoute = new AuthRoute();
      const customers = authRoute.authController.authService.customer;

      customers.findOne = jest.fn().mockReturnValue(null);
      customers.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      const { body, status } = await request(app.getServer()).post(`${basePath}${authRoute.authPath}/signUp`).send(userData);
      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data.accountNumber).toBeDefined();
    });
  });

  describe('[POST] /login', () => {
    it('should return token for registered customers', async () => {
      const authRoute = new AuthRoute();
      const customers = authRoute.authController.authService.customer;
      const { password } = baseData;
      customers.findOne = jest.fn().mockReturnValue({
        password: await bcrypt.hash(password, 10),
        account: '5653782736',
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      const { body, status } = await request(app.getServer()).post(`${basePath}${authRoute.authPath}/signIn`).send(baseData);
      expect(status).toBe(200);
      expect(body.data.tokenData).toBeDefined();
    });
  });
});
