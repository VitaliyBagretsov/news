import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#auth';
import { CommonService } from '#common';

import { MediaService } from './media.service.js';
import { MediaController } from './media.controller.js';
import { Media } from './entities/media.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService, CommonService],
})
export class MediaModule {}
