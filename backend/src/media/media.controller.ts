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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Roles, RolesGuard, SessionAuthGuard } from '#auth';
import { CommonService } from '#common';
import { MediaService } from './media.service.js';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { Media } from './entities/media.entity.js';
import type { UploadedMediaImage } from './media-image.types.js';
import { MediaImagesService } from './media-images.service.js';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly commonService: CommonService,
    private readonly mediaImagesService: MediaImagesService,
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

  @Get('images/:fileName')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async getImage(@Param('fileName') fileName: string): Promise<StreamableFile> {
    const image = await this.mediaImagesService.open(fileName);
    return new StreamableFile(image.stream, { type: image.contentType });
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/logo')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  updateLogo(
    @Param('id') id: string,
    @UploadedFile() file: UploadedMediaImage | undefined,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.mediaService.updateLogo(+id, file);
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/logo')
  removeLogo(@Param('id') id: string) {
    return this.mediaService.removeLogo(+id);
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
