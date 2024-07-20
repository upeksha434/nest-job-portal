import { Body, Controller, Post } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { GetServiceDto } from './employerDto/getservice.dto';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('getservice')
  async getServiceProviders(@Body() data: GetServiceDto) {
    return await this.employerService.getServiceProviders(data);
  }

}
