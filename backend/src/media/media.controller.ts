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

import { Roles, RolesGuard, SessionAuthGuard } from '#auth';
import { CommonService } from '#common';
import { MediaService } from './media.service.js';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { Media } from './entities/media.entity.js';

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
  @Roles('user', 'admin')
  @Get()
  async find(@Query() query: Record<string, unknown>) {
    const result = await this.commonService.getData<Media>('media', query);

    return {
      ...result,
      data: await this.mediaService.addStatistics(result.data),
    };
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get('all')
  findAll() {
    return this.mediaService.findAll();
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('user', 'admin')
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
