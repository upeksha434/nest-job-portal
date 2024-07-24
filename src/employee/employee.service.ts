import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostReviewDto } from './employeeDto/postReview.dto';
@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService) {}

    async getEmployeeRating(employeeId: number): Promise<object> {
        employeeId = parseInt(employeeId.toString());
    
        let ratings = await this.prisma.rating.findMany({
            where: {
                employeeId: employeeId,
            },
        });
    
        for (let i = 0; i < ratings.length; i++) {
            let user = await this.prisma.user.findUnique({
                where: {
                    id: ratings[i].employerId,
                },
            });
            ratings[i]['employerName'] = user.fname + ' ' + user.lname;

            let profilePic = await this.prisma.profilePics.findFirst({
                where: {
                    userId: ratings[i].employerId,
                },
            });
            ratings[i]['profilePic'] = profilePic ? profilePic.url : 'https://myjopportal-sem6.s3.eu-north-1.amazonaws.com/3da39-no-user-image-icon-27.webp';
        }
    
        let totalRatings = ratings.length;
        let averageRating = totalRatings > 0 
            ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings 
            : 0;
    
        return {
            ratings: ratings,
            averageRating: averageRating,
            totalRatings: totalRatings
        };
    }

    async postReview(data:PostReviewDto): Promise<object> {
        return await this.prisma.rating.create({
            data: {
                employerId: data.employerId,
                employeeId: data.employeeId,
                rating: data.rating,
                review: data.review,
            },
        });
    }

    async editReview(data:PostReviewDto,id:string): Promise<object> {
        return await this.prisma.rating.update({
            where: {
                
                id: parseInt(id),
                
            },
            data: {
                rating: data.rating,
                review: data.review,
            },
        });

    }

    


}
