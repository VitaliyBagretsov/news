import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RolesGuard } from '#common/guards/role.guard';
import { SessionAuthGuard } from '#common/guards/session-auth.guard';
import { CommonService } from '#common/common.service';
import { MediaService } from './media.service.js';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { Media } from './entities/media.entity.js';
import { Roles } from '#decorators';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly commonService: CommonService,
  ) {}

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  find(@Query() query: Record<string, unknown>) {
    return this.commonService.getData<Media>('media', query);
  }

  // @UseGuards(SessionAuthGuard, RolesGuard)
  // @Roles('user')
  @Get('all')
  findAll() {
    return this.mediaService.findAll();
  }

  // @UseGuards(SessionAuthGuard, RolesGuard)
  // @Roles('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
