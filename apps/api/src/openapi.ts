import 'reflect-metadata';
import { writeFile } from 'node:fs/promises';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

const app = await NestFactory.create(AppModule, { logger: false });
const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('ADO API').setVersion('v1').build());
await writeFile(new URL('../openapi.json', import.meta.url), `${JSON.stringify(document, null, 2)}\n`);
await app.close();
