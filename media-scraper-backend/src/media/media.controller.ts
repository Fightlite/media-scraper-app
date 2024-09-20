import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getMedia(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('type') type?: string,
    @Query('search') searchText?: string,
  ) {
    return this.mediaService.getMediaData(+page, +limit, type, searchText);
  }
}
