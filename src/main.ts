import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription('The Job Portal API description')
    .setVersion('1.0')
    .addTag('JobPortal')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  


  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
