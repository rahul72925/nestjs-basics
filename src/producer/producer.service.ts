import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RabbitMQConfig } from 'src/microservices/rabbitmq.options';

@Injectable()
export class ProducerService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(RabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any): Promise<any> {
    return firstValueFrom(this.client.send(pattern, data));
  }
}
