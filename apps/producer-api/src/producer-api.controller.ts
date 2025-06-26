import { RabbitMQService } from '@app/rabbitmq/rabbitmq.service';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('producer-api')
export class ProducerApiController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post()
  async createTransaction(@Body() body: any) {
    await this.rabbitMQService.sendToQueue('transactions_queue', body);
    return { status: 'Transaction sent to queue' };
  }

  @Get()
  async check() {
    return {status: 'ok'}
  }
}
