import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { AzureADGuard } from './common/guards/authentication/authentication.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalGuards(new AzureADGuard());

  const swaggerConfig = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.APP_PORT || 4000);
}

// creates swagger config
function createSwaggerConfig() {
  const link = getEnvironmentLink();
  return new DocumentBuilder()
    .setTitle(`Foxtrot - Calendar API ENV:${process.env.ENV}`)
    .setDescription(`Swagger documentation for the Fence Calendar API: ${link}`)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token required For authentication',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    )
    .build();
}

// returns the link for the environment
function getEnvironmentLink() {
  switch (process.env.ENV) {
    case 'dev':
      return 'https://fence-calendar-web-app-ci-okebfkdgwq-uc.a.run.app/';
    case 'qa':
      return 'https://fence-calendar-api-qa-okebfkdgwq-uc.a.run.app';
    case 'prod':
      return 'https://fence-calendar-api-prod-okebfkdgwq-uc.a.run.app';
    default:
      return '';
  }
}

bootstrap();
