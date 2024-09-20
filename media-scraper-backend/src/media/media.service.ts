import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async getMediaData(page: number, limit: number, type?: string, searchText?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (type && type !== 'all') {
      whereClause.type = type;
    }
    
    let whereConditions = [whereClause];

    if (searchText) {
      whereConditions = [
        { ...whereClause, title: Like(`%${searchText}%`) },
        { ...whereClause, description: Like(`%${searchText}%`) },
      ];
    }

    const [items, count] = await this.mediaRepository.findAndCount({
      where: whereConditions,
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    return {
      totalItems: count,
      items,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }
}
