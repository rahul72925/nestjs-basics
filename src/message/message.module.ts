import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ProducerModule } from 'src/producer/producer.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [ProducerModule],
})
export class MessageModule {}
