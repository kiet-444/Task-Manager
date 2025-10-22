import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }
  ));
  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('API documentation for the Task Manager')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document); 
  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }
  ));
  
}
bootstrap();
