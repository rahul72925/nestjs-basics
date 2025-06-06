import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { ProducerService } from 'src/producer/producer.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly producerService: ProducerService,
  ) {}

  @Post()
  async sendMessage(@Body() message: { content: string }) {
    await this.producerService.sendMessage('my_pattern', message);
    return 'Message sent!';
  }
}
