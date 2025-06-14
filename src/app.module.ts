// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getTypeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { WSGateway } from './common/gateways/app.gateway';
import { ConsumerController } from './consumer/consumer.controller';
import { MessageModule } from './message/message.module';
import { ProducerModule } from './producer/producer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST') || 'localhost',
        port: configService.get<number>('REDIS_PORT') || 6379,
      }),
    }),
    UsersModule,
    MessageModule,
    ProducerModule,
    AuthModule,
  ],
  providers: [WSGateway],
  controllers: [ConsumerController],
})
export class AppModule {}
