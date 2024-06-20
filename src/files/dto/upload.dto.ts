import { IsNotEmpty, IsString } from "class-validator";

export class UploadDto{
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    @IsString()
    url: string;
}