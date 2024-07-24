import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// employerId: number, employeeId: number, rating: number, review: string 
export class PostReviewDto {
    @IsNotEmpty()
    @IsNumber()
    employerId: number;

    @IsNotEmpty()
    @IsNumber()
    employeeId: number;

    
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    
    @IsString()
    review: string;
}