import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '@app/rabbitmq/rabbitmq.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    await this.rabbitMQService.addConsumer(
      'transactions_queue',
      async (transaction) => {
        console.log('Processing transaction:', transaction);

        await this.sleep(100 + Math.random() * 400);

        const cashback = (transaction.amount * 0.02).toFixed(2);

        console.log(`Transaction processed: cashback = ${cashback}`);
      },
    );
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
