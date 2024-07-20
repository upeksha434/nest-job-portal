import { All, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetServiceDto } from './employerDto/getservice.dto';

@Injectable()
export class EmployerService {
  constructor(private readonly prisma: PrismaService) {}

  async getServiceProviders(data: GetServiceDto): Promise<object> {
    // Create conditions to search for the service term in the profileDescription
    const tagCondition = {
      profileDescription: {
        contains: `#${data.service}`, // Look for the service tag in the profile description
      },
    };

    const broadCondition = {
      profileDescription: {
        contains: data.service, // Look for the service term in the profile description
      },
    };

    let result= await this.prisma.user.findMany({
      where: {
        AND: [
          {
            location: {
              contains: data.location, // Match the location
            },
          },
          {
            OR: [
              tagCondition,
              broadCondition,
            ],
          },
        ],
      },
    });

    for (let i = 0; i < result.length; i++) {
      const user_id=result[i].id
      //remove password from the result
        delete result[i].password;
      await this.prisma.profilePics.findFirst({
        where: {
          userId: user_id,
        },
      }).then((res) => {
        //if profile pic is not found, set a default profile pic
        if (res == null) {
          result[i]['profilePic'] = 'https://myjopportal-sem6.s3.eu-north-1.amazonaws.com/3da39-no-user-image-icon-27.webp';
          return;
        }
        result[i]['profilePic'] = res.url;
      })
      const ratings = await this.prisma.rating.findMany({
        where: { employeeId: user_id },
      });
      if (ratings.length > 0) {
        const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
        result[i]['averageRating'] = averageRating;
      } else {
        result[i]['averageRating'] = null; // or some default value if no ratings
      }
    }
    return result;
  }
}
