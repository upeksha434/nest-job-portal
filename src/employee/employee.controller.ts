import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { PostReviewDto } from './employeeDto/postReview.dto';

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

  @Post('postReview')
  async postReview(@Body() data: PostReviewDto) {
    return await this.employeeService.postReview(data);
  }

  @Post('editReview/:id')
  async editReview(@Body() data: PostReviewDto, @Param('id') id: number) {
    return await this.employeeService.editReview(data, id);
  }

}
