import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  
  export class LoginDto {
    // @IsNotEmpty()
    // @IsString()
    // fname: string;

    // @IsNotEmpty()
    // @IsString()
    // lname: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;


    roleId: number;
  }

  export class ResetDataDto{
    @IsNotEmpty()
      @IsString()
      @MinLength(6)
      @MaxLength(20)
      @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
      
      password: string;
  }
  
  export class ValidationPasswordDto {
    @IsNotEmpty()
    @IsString()
    otp: string;
  
    @IsNotEmpty()
    @IsString()
    email: string;
  }
  
  export class ForgetPasswordDto{
    @IsNotEmpty()
    @IsString()
    email: string;
  }