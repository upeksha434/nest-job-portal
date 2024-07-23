import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
    


}
