import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwt_config } from 'src/config/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
          property: 'user',
          session: false,
        }),
        JwtModule.register({
          global: true,
          secret: jwt_config.secret,
          signOptions: {
            expiresIn: jwt_config.expired,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, PrismaService],
    
})
export class AuthModule {}
