import { Module } from '@nestjs/common';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrape } from './scrape.entity';
import { Media } from 'src/media/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scrape, Media])],
  controllers: [ScrapeController],
  providers: [ScrapeService],
})
export class ScrapeModule {}
