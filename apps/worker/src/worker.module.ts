import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { RabbitmqModule, RabbitMQService } from '@app/rabbitmq';

@Module({
  imports: [RabbitmqModule],
  providers: [WorkerService, RabbitMQService],
})
export class WorkerModule {}
