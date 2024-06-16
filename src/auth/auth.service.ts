import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
@Injectable()
export class AuthService {


    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(data: RegisterDto) {
        const checkUserExists = await this.prisma.user.findFirst({
          where: {
            email: data.email,
          },
        });

    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }  
    data.password = await hash(data.password, 12);

    const createUser = await this.prisma.user.create({
      data: data,
    });

    await this.prisma.user.update({
      where: {
        id: createUser.id,
      },
      data:{isVerified : true}
    }); 
    
    return{
        message: 'Sign Up Successfull!'
    }

    }



}
