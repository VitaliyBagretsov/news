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

import { AccessTokenGuard } from '@common/guards/accessToken.guard';
import { CommonService } from '@common/common.service';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { Roles } from '@decorators';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly commonService: CommonService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles('user')
  @Get()
  find(@Query() query: Record<string, unknown>) {
    return this.commonService.getData<Media>('media', query);
  }

  // @UseGuards(AccessTokenGuard)
  // @Roles('user')
  @Get('all')
  findAll() {
    return this.mediaService.findAll();
  }

  // @UseGuards(AccessTokenGuard)
  // @Roles('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
