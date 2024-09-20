import { ReadableStream } from 'web-streams-polyfill';
(global as any).ReadableStream = ReadableStream;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMiddleware } from './middleware/error.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorMiddleware());
  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();
