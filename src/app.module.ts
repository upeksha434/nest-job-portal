import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmployerModule } from './employer/employer.module';
import { ChatsModule } from './chats/chats.module';


@Module({
  imports: [
   AuthModule, FilesModule,ConfigModule.forRoot({
      isGlobal: true,
    }), EmployerModule, ChatsModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  
})
export class AppModule {}
