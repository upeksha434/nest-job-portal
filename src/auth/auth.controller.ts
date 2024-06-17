import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ValidationDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
      return await this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
      return await this.authService.login(data);
  }

  @Post('verify')
  async verify(@Body() data: ValidationDto) {
      return await this.authService.emailVerification(data['otp'], data['email']);
  }

}
