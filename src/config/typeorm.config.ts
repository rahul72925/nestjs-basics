import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('POSTGRES_HOST');
  const port = parseInt(
    configService.get<string>('POSTGRES_PORT') || '5432',
    10,
  );
  const username = configService.get<string>('POSTGRES_USERNAME');
  const password = configService.get<string>('POSTGRES_PASSWORD');
  const database = configService.get<string>('POSTGRES_DATABASE');
  const ssl = configService.get<string>('SSL_ENABLED') === 'true';

  console.log({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: true,
    logging: true,
    ssl,
  });

  if (!host || !username || !password || !database) {
    throw new Error('Database configuration is incomplete');
  }

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: true,
    logging: true,
    ssl,
  };
};
