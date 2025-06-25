import { Module } from '@nestjs/common';
import { ProducerApiController } from './producer-api.controller';
import { ProducerApiService } from './producer-api.service';
import { RabbitmqModule, RabbitMQService } from '@app/rabbitmq';

@Module({
  imports: [RabbitmqModule],
  controllers: [ProducerApiController],
  providers: [ProducerApiService, RabbitMQService],
})
export class ProducerApiModule {}
