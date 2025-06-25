import { Module } from '@nestjs/common';
import { ProducerApiController } from './producer-api.controller';
import { RabbitmqModule, RabbitMQService } from '@app/rabbitmq';

@Module({
  imports: [RabbitmqModule],
  controllers: [ProducerApiController],
  providers: [RabbitMQService],
})
export class ProducerApiModule {}
