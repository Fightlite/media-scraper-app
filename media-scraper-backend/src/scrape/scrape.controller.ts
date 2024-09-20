import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('api/scrape')
@UseGuards(AuthGuard('jwt'))
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post()
  async scrapeMedia(@Body() body: { urls: string[] }) {
    await this.scrapeService.scrapeUrls(body.urls);
    return { success: true, message: 'Scraping process started' };
  }
}
