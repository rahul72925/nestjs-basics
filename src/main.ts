import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQConfig } from './microservices/rabbitmq.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(RabbitMQConfig());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
