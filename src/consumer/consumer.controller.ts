import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  @MessagePattern('my_pattern')
  handleMessages(data: Record<string, any>) {
    console.log('received1', data);
    return { status: 'received', data };
  }
}
