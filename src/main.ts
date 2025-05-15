import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: true, // Permite todas las origenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Voice QA API')
    .setDescription('API for managing voice calls, evaluations, and user management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  // Logs de inicio
  console.log('=================================');
  console.log('🚀 Application is running');
  console.log(`📡 URL: ${await app.getUrl()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Port: ${port}`);
  console.log(`🏠 Host: 0.0.0.0`);
  console.log('=================================');
}
bootstrap();