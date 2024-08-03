import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, userInfoDto, ValidationDto } from './dto/register.dto';
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
  @Get('profile/:id')
  async getProfileInfo(@Param ('id') id:string){
    return await this.authService.getProfileInfo(id);
  }

  @Put('updateProfile/:id')
  async updateProfile(@Param ('id') id:string, @Body() data: userInfoDto){
    return await this.authService.updateProfileInfo(id, data);
  }

}
