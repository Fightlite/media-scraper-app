import { Media } from 'src/media/media.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Scrape {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  status: 'pending' | 'in_progress' | 'done' | 'error';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Media, media => media.scrape, { cascade: true })
  medias: Media[];
}
