import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { msgDto } from './dto/msg.dto';
import { get } from 'http';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('sendMessage')
  async sendMessage(@Body() data: msgDto) {
    return await this.chatsService.sendMessage(data);
  }
  @Post('getMessages')
  async getMessages(@Body() data: { employerId: number; employeeId: number }) {
    return await this.chatsService.getMessages(data.employerId, data.employeeId);
  }
  @Post('getEmployeeChats')
  async getEmployeeChats(@Body() data: { employeeId: number ,roleId:number}) {
    if(data.roleId==1){
      return await this.chatsService.getEmployerChats(data.employeeId);
    }
    else{
    return await this.chatsService.getEmployeeChats(data.employeeId);
    }
  }
}
