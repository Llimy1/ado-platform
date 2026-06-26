import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loadEnvironment } from '@ado/config';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const environment = loadEnvironment();
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.enableCors({ origin: environment.ADO_CONTROL_ORIGIN, methods: ['GET'], allowedHeaders: ['Content-Type'] });
  const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('ADO API').setVersion('v1').build());
  SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: 'openapi.json' });
  app.enableShutdownHooks();
  await app.listen(environment.ADO_API_PORT);
}

void bootstrap();
