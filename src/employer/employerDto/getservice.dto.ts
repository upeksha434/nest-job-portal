import { IsNotEmpty, IsString } from "class-validator";

export class GetServiceDto{
    @IsNotEmpty()
    @IsString()
    service: string;

    @IsNotEmpty()
    @IsString()
    location: string;
}