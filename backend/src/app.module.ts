import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TasksService } from '#task.service';
import { MediaModule } from './media/media.module.js';
import { NewsModule } from './news/news.module.js';
import { CommonService } from '#common/common.service';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('POSTGRES_HOST'),
          port: Number(configService.getOrThrow<string>('POSTGRES_PORT')),
          username: configService.getOrThrow<string>('POSTGRES_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('POSTGRES_DB'),
          synchronize: true,
          entities: [join(moduleDirectory, '**', '*.entity{.js,.ts}')],
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    MediaModule,
    NewsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, CommonService],
})
export class AppModule {}
