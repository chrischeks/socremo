import { NextFunction, Response, Request } from 'express';
import AuthService from './auth.service';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import UniversalController from '@/@universal/controller/universal.controller';
import { ICustomer } from '@/@universal/interfaces/customer.interface';
import { CreateAccountDTO, CreateBasicEntityDTO, SignInDTO } from './auth.dto';
import { OtpDTO } from '@/otp/otp.dto';

class AuthController extends UniversalController {
  public authService = new AuthService();

  public createEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateAccountDTO = req.body;
      const response = await this.authService.processCreateEntity(userData);
      res.send(response);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, originalUrl, method, headers } = req;
    try {
      const userData: OtpDTO = req.body;
      const response = await this.authService.processSendOTP(userData, { ip, originalUrl, method, headers });
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public validateOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateCustomerDTO = req.body;
      const response = await this.authService.processValidateOTP(userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateCustomerDTO = req.body;
      const response = await this.authService.processCreateCustomer(userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public basicRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateBasicEntityDTO = req.body;
      const response = await this.authService.processBasicRegistration(userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public signIn = async (req: Request & { customer: ICustomer }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: SignInDTO = req.body;
      const response = await this.authService.processSignIn(customerData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };
}

export default AuthController;
