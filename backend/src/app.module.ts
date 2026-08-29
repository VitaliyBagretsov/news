import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AuthModule } from '#auth';
import { MediaModule } from '#media';
import { NewsModule } from '#news';
import { NewsCollectorModule } from '#news-collector';
import { UsersModule } from '#users';
import { AppController } from './app.controller.js';
import configuration from './config/configuration.js';
import { TasksService } from './task.service.js';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const synchronize = configService.get<string>('TYPEORM_SYNCHRONIZE');

        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('POSTGRES_HOST'),
          port: Number(configService.getOrThrow<string>('POSTGRES_PORT')),
          username: configService.getOrThrow<string>('POSTGRES_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('POSTGRES_DB'),
          synchronize:
            synchronize === undefined
              ? process.env.NODE_ENV !== 'production'
              : synchronize === 'true',
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
    NewsCollectorModule,
  ],
  controllers: [AppController],
  providers: [TasksService],
})
export class AppModule {}
