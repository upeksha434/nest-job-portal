import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto, userInfoDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { ForgetPasswordDto, LoginDto } from './dto/login.dto';
import { jwt_config } from 'src/config/jwt';
import * as Brevo from '@getbrevo/brevo'; 
import { profile } from 'node:console';
import { parse } from 'node:path';
@Injectable()
export class AuthService {


    constructor(private prisma: PrismaService, private jwtService: JwtService) { }


    async sendOTPEmail(otp:string, email:string,name:string, end:string){
        const brevo = require('@getbrevo/brevo');
        let apiInstance = new brevo.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey =    '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';
        let sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = `Common: Your OTP CODE Is ${otp}`;
        sendSmtpEmail.htmlContent = `
        <html>
            <head>
            <title>Common: Your OTP CODE Is ${otp}</title>
            </head>
            <body>
            <h1>Your OTP CODE Is ${otp}</h1>
            <p>Hi ${name},</p>
            <p>Your OTP CODE Is ${otp}</p>
            <p>${end}</p>
            <p>Thanks</p>
            </body>
        </html>
        `;
        sendSmtpEmail.sender = { "name": "JobPortal Platform", "email": "no-reply@jopportal.com"  };
        sendSmtpEmail.to = [
        { "email": email, "name": name }
        ];
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
        console.error("error sending mail",error);
        });
    }


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
        data:{isVerified : false}
        }); 

        if (createUser) {

            const otp = Math.floor(100000 + Math.random() * 900000);
      
            // Send Email : Temp disabled for dev.
            
            const end:string="This is OTP for email verification."+"\n"+"Pleses verify your email address to complete your registration."
            this.sendOTPEmail(otp.toString(), createUser.email, createUser.fname + ' ' + createUser.lname,end);
      
            // Create Email Verification Record
            await this.prisma.emailVerifications.create({//emailVerifications is the table name
              data: {
                otp: otp.toString(),
                userId: createUser.id
              }
            });

            return{
                message: 'OTP sent successfully!'
            }
        }       
    }

    async emailVerification(otp: string, email: string) {
        const checkOtp = await this.prisma.emailVerifications.findFirst({
          where: {
            otp: otp,
            user: {
              email: email
            },
            createdAt: {
              gte: new Date(new Date().getTime() - 5 * 60 * 1000)
            }
          }
        });
    
        if (!checkOtp) {
          throw new HttpException(`Invalid OTP,${checkOtp}, ${email}`, HttpStatus.UNAUTHORIZED);
        } else {
          const updateUser = await this.prisma.user.update({
            where: {
              id: checkOtp.userId
            },
            data: {
              isVerified: true
            }
          });
    
          if (updateUser) {
            return {
              message: 'Email Verified Successfully!'
            }
          }
        }
        //need a function for resending the OTP
      }

    
    async login(data: LoginDto): Promise<object> {
        //jdfhj456461%@^W
        const user = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            isVerified: true
          },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          }
      
          const checkPassword = await compare(
            data.password,
            user.password,
          );
      
          if (checkPassword) {
            const accessToken = this.generateJWT({
              sub: user.id,
              fname: user.fname,
              email: user.email,
            });
      
            return {
              user: user,
              accessToken: accessToken,
            };
          } else {
            throw new HttpException(
              'User or password not match',
              HttpStatus.UNAUTHORIZED,
            );
          }

    }
    generateJWT(payload: any) {
        return this.jwtService.sign(payload, {
          secret: jwt_config.secret,
          expiresIn: jwt_config.expired,
        });
    }

    async forgetPassword(forgetPasswordDto:ForgetPasswordDto) {
        //let user enter the email address
        const checkUserExists= await this.prisma.user.findFirst({
          where:{
            email:forgetPasswordDto.email,
          }
        });
        console.log(checkUserExists);
        if(!checkUserExists){
          throw new HttpException('Email does not exists. Enter a valid email...', HttpStatus.UNAUTHORIZED)
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        // Send Email
          
        const end:string="This is OTP for Password Reset."+"\n"+"Pleses enter the OTP to change Password."
        this.sendOTPEmail(otp.toString(), forgetPasswordDto.email, checkUserExists.fname + ' ' + checkUserExists.lname,end);
        
        //create passwordOTP verification Record
        await this.prisma.forgetPassword.create({
          data:{
            otp:otp.toString(),
            userId:checkUserExists.id
          }
        });
        return{
          message:'UI should direct to the OTP verification page',
        };
      }


      async getProfileInfo(id:string){
        const user = await this.prisma.user.findUnique({
          where:{
            id:parseInt(id)
          }
        });
       let profilepic = await this.prisma.profilePics.findFirst({
          where:{
            userId:user.id
          }
        });
        console.log(profilepic);
        console.log(user);
        user['profilePic'] = profilepic.url;
        user['profilePicId'] = profilepic.id;
        return user;
      }

      async updateProfileInfo(id:string,data:userInfoDto){
        console.log(data);
        // const user = await this.prisma.user.update({
        //   where:{
        //     id:parseInt(id)
        //   },
        //   data:{
        //     ...data
        //   }
        // });
        const oldUser = await this.prisma.user.findUnique({
          where:{
            id:parseInt(id)
          }
        });
        
        //find the changes in the data and update the user
        let changes = {};
        for(let key in data){
          if(data[key] != oldUser[key] && data[key] != ''){
            changes[key] = data[key];
          }
        }
        console.log(changes);
        const user = await this.prisma.user.update({
          where:{
            id:parseInt(id)
          },
          data:{
            ...changes
          }
        });

        return user;
      }

      









}
