import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ErrorMiddleware } from './middleware/error.middleware';
import { ScrapeModule } from './scrape/scrape.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    MediaModule,
    ScrapeModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorMiddleware,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}