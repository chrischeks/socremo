import { Router } from 'express';
import Route from '@/@universal/interfaces/route.interface';
import validationMiddleware from '@/@universal/middlewares/validation.middleware';
import { CreateCustomerDTO } from '@/@universal/dto/customer.dto';
import AuthController from './auth.controller';
import { CreateAccountDTO, CreateBasicEntityDTO, SignInDTO } from './auth.dto';
import { OtpDTO } from '@/otp/otp.dto';

class AuthRoute implements Route {
  public authPath = '/auth';

  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.authPath}/create`, validationMiddleware(CreateAccountDTO, 'body'), this.authController.createEntity);
    this.router.post(`${this.authPath}/signUp`, validationMiddleware(CreateCustomerDTO, 'body'), this.authController.createCustomer);
    this.router.post(`${this.authPath}/signIn`, validationMiddleware(SignInDTO, 'body'), this.authController.signIn);
    this.router.post(`${this.authPath}/basic-reg`, validationMiddleware(CreateBasicEntityDTO, 'body'), this.authController.basicRegistration);
    this.router.post(`${this.authPath}/send-otp`, validationMiddleware(OtpDTO, 'body'), this.authController.sendOTP);
    this.router.post(`${this.authPath}/validate-otp`, validationMiddleware(OtpDTO, 'body'), this.authController.validateOTP);
  }
}

export default AuthRoute;
