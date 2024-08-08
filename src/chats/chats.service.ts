import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { msgDto } from './dto/msg.dto';

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}

    async sendMessage(data:msgDto): Promise<object> {
        console.log(data.sender,"sender Id",data);
        return await this.prisma.chathistory.create({
            
            data: {
                employerId: data.employerId,
                employeeId: data.employeeId,
                senderId: data.sender,
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
    async getEmployerChats(employerId: number): Promise<object[]> {
      const chats = await this.prisma.chathistory.findMany({
        where: {
          employerId: employerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const groupedChats = chats.reduce((acc, chat) => {
        if (!acc[chat.employeeId]) {
          acc[chat.employeeId] = [];
        }
        acc[chat.employeeId].push(chat);
        return acc;
      }, {} as Record<number, typeof chats>);

      const chatDetails = await Promise.all(
        Object.keys(groupedChats).map(async (employeeId) => {
          const chatsWithEmployee = groupedChats[+employeeId];
          const mostRecentMessage = chatsWithEmployee[0];
          const profilePic = await this.prisma.profilePics.findFirst({
              where:{
                  userId: +employeeId,
              }
          });
          const employee = await this.prisma.user.findUnique({
            where: {
              id: +employeeId,
            },
          });

          return {
            OtherEndId: +employeeId,
            OtherEndName: employee.fname + " " + employee.lname,
            OtherEndProfilePic: profilePic.url,
            message: mostRecentMessage.message,
            senderId: mostRecentMessage.senderId,
            createdAt: mostRecentMessage.createdAt,
          };
        })
      );
      return chatDetails;
    }
    async getEmployeeChats(employeeId: number): Promise<object[]> {
        // Fetch all chat histories for the given employee
        const chats = await this.prisma.chathistory.findMany({
          where: {
            employeeId: employeeId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
    
        // Group by employerId
        const groupedChats = chats.reduce((acc, chat) => {
          if (!acc[chat.employerId]) {
            acc[chat.employerId] = [];
          }
          acc[chat.employerId].push(chat);
          return acc;
        }, {} as Record<number, typeof chats>);
    
        // Fetch the employer details and get the most recent message for each group
        const chatDetails = await Promise.all(
          Object.keys(groupedChats).map(async (employerId) => {
            const chatsWithEmployer = groupedChats[+employerId];
            const mostRecentMessage = chatsWithEmployer[0];
            const profilePic = await this.prisma.profilePics.findFirst({
                where:{
                    userId: +employerId,
                }
            });
            console.log(profilePic,+employerId);
            const employer = await this.prisma.user.findUnique({
              where: {
                id: +employerId,
              },
            });
    
            return {
              OtherEndId: +employerId,
              OtherEndName: employer.fname + " " + employer.lname,
              OtherEndProfilePic: profilePic.url,
              message: mostRecentMessage.message,
              senderId: mostRecentMessage.senderId,
              createdAt: mostRecentMessage.createdAt,
            };
          })
        );
    
        return chatDetails;
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
