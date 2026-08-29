import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#auth';
import { CommonService } from '#common';

import { MediaController } from './controllers/index.js';
import { Media } from './entities/media.entity.js';
import { MediaImagesService, MediaService } from './services/index.js';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService, MediaImagesService, CommonService],
})
export class MediaModule {}
