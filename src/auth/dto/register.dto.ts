import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
    IsNumber,
    Min,
    Max,
  } from 'class-validator';
//   id  Int @id @default(autoincrement())
//   roleId Int
//   fname String
//   lname String
//   email String @unique
//   password String
//   location String?
//   jobType String?
//   profileDescription String
//   hourlyRate Float?

export class RegisterDto{
    roleId: number;

    @IsNotEmpty()
    @IsString()
    fname: string;

    @IsNotEmpty()
    @IsString()
    lname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',})
    password: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    jobType?: string;

    @IsNotEmpty()
    @IsString()
    profileDescription: string;

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'hourlyRate must be a number' })
    @Min(0, { message: 'hourlyRate must be at least 0' })
    @Max(1000, { message: 'hourlyRate must be at most 1000' })
    hourlyRate?: number;
}
export class ValidationDto {
    @IsNotEmpty()
    @IsString()
    otp: string;
  
    @IsNotEmpty()
    @IsString()
    email: string;
  }

export class userInfoDto{
    @IsNotEmpty()
    @IsString()
    fname: string;

    @IsNotEmpty()
    @IsString()
    lname: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
    location?: string;
    jobType?: string;
    @IsNotEmpty()
    @IsString()

    profileDescription: string;
    hourlyRate?: number;
}