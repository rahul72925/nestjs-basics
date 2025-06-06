import { Transport, RmqOptions } from '@nestjs/microservices';

export const RabbitMQConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'my_queue',
    queueOptions: {
      durable: true,
    },
  },
});
