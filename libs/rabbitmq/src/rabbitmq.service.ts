import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection;
  private channelWrapper: ChannelWrapper;

  async onModuleInit() {
    this.connection = amqp.connect(['amqp://guest:guest@rabbitmq:5672']);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) =>
        channel.assertQueue('transactions_queue', { durable: true }),
    });

    console.log('RabbitMQ connected and channel ready');
  }

  async sendToQueue(queue: string, message: any) {
    await this.channelWrapper.sendToQueue(queue, message);
  }

  async addConsumer(queue: string, onMessage: (msg: any) => Promise<void>) {
    await this.channelWrapper.addSetup((channel) =>
      channel.consume(
        queue,
        async (msg) => {
          const content = JSON.parse(msg.content.toString());
          try {
            await onMessage(content);
            channel.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            channel.nack(msg);
          }
        },
        { noAck: false },
      ),
    );
  }

  async onModuleDestroy() {
    await this.connection.close();
    console.log('RabbitMQ connection closed');
  }
}
