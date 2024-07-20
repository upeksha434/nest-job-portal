import { Injectable } from '@nestjs/common';
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

    return await this.prisma.user.findMany({
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
  }
}
