import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('getEmployeeRatings/:employeeId')
  // @Get('/search/:alias/:table')
  // async searchUser(@Param('alias')alias:string, @Param('table') table:string){
  //   const builder= await this.usersService.queryBuilder(alias,table);
  //   //console.log(table)
  //   return await builder;
  // }

  async getEmployeeRatings(@Param('employeeId')employeeId: number) {
    return await this.employeeService.getEmployeeRating(employeeId);
  }

}
