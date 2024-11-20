import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthRoleModule } from '@auth/auth-role.module';
import { CommonService } from '@common/common.service';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]), 
    // AuthRoleModule
  ],
  controllers: [MediaController],
  providers: [MediaService, CommonService],
})
export class MediaModule {}
