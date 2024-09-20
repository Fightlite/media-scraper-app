import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scrape } from './scrape.entity';
import { Media } from '../media/media.entity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  constructor(
    @InjectRepository(Scrape)
    private scrapeRepository: Repository<Scrape>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async scrapeUrls(urls: string[]): Promise<void> {
    for (const url of urls) {
      await this.scrapeUrl(url);
    }
  }

  private async scrapeUrl(url: string): Promise<void> {
    let scrape = await this.scrapeRepository.findOne({ where: { url } });

    if (scrape && scrape.status === 'done') {
      this.logger.log(`URL ${url} has already been scraped. Skipping.`);
      return;
    }

    if (!scrape) {
      scrape = this.scrapeRepository.create({ url, status: 'pending' });
      await this.scrapeRepository.save(scrape);
    }

    scrape.status = 'in_progress';
    await this.scrapeRepository.save(scrape);

    try {
      let mediaItems: Partial<Media>[] = [];

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        mediaItems = await this.scrapeYouTube(url);
      } else {
        // Try SSR scraping first
        mediaItems = await this.scrapeSSR(url);
        // If SSR scraping doesn't find any media, try CSR scraping
        if (mediaItems.length === 0) {
          mediaItems = await this.scrapeCSR(url);
        }
      }

      await this.mediaRepository.save(mediaItems);
      scrape.status = 'done';
      scrape.medias = mediaItems as Media[];

      await this.scrapeRepository.save(scrape);

      this.logger.log(`Successfully scraped ${url}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error scraping ${url}: ${error.message}`);
      } else {
        this.logger.error(`Error scraping ${url}: ${String(error)}`);
      }
      scrape.status = 'error';
      await this.scrapeRepository.save(scrape);
    }
  }

  private async scrapeSSR(url: string): Promise<Partial<Media>[]> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return this.extractMediaFromCheerio($, url);
  }

  private async scrapeCSR(url: string): Promise<Partial<Media>[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);
    return this.extractMediaFromCheerio($, url);
  }

  private extractMediaFromCheerio($: cheerio.CheerioAPI, baseUrl: string): Partial<Media>[] {
    const mediaItems: Partial<Media>[] = [];

    // Helper function to resolve relative URLs
    const resolveUrl = (relativeUrl: string) => new URL(relativeUrl, baseUrl).href;

    // Scrape images
    $('img').each((_, element) => {
      const imgUrl = $(element).attr('src');
      if (imgUrl) {
        mediaItems.push({
          url: resolveUrl(imgUrl),
          type: 'image',
          title: $(element).attr('alt') || '',
        });
      }
    });

    // Scrape videos
    $('video').each((_, element) => {
      const videoUrl = $(element).attr('src');
      if (videoUrl) {
        mediaItems.push({
          url: resolveUrl(videoUrl),
          type: 'video',
          title: $(element).attr('title') || '',
        });
      }
    });

    // Scrape iframes
    $('iframe').each((_, element) => {
      const iframeSrc = $(element).attr('src');
      if (iframeSrc) {
        mediaItems.push({
          url: resolveUrl(iframeSrc),
          type: 'video',
          title: $(element).attr('title') || '',
        });
      }
    });

    return mediaItems;
  }

  private async scrapeYouTube(url: string): Promise<Partial<Media>[]> {
    const videoId = this.extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
  
    return [{
      url: `https://www.youtube.com/embed/${videoId}`,
      type: 'video',
      title: `YouTube video ${videoId}`,
    }];
  }
  
  private extractYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}
