import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { msgDto } from './dto/msg.dto';

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}

    async sendMessage(data:msgDto): Promise<object> {
        return await this.prisma.chathistory.create({
            data: {
                employerId: data.employerId,
                employeeId: data.employeeId,
                message: data.message,
            },
        });
    }

    async getMessages(employerId: number, employeeId: number): Promise<object> {
        return await this.prisma.chathistory.findMany({
            where: {
                AND: [
                    {
                        employerId: employerId,
                    },
                    {
                        employeeId: employeeId,
                    },
                ],
            },
        });
    }

    async editMsg(msgId: number,data:msgDto): Promise<object> {
       var msg = await this.prisma.chathistory.findUnique({
            where: {
                id: msgId,
            },
        });

        msg.message = data.message;
        msg.isEdited = true;
        
        return await this.prisma.chathistory.update({
            where: {
                id: msgId,
            },
            data:{
                message: msg.message,
                isEdited: msg.isEdited,
            }
        });

        
    }
}
