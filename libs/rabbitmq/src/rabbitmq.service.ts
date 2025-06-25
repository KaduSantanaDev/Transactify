import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection;
  private channelWrapper: ChannelWrapper;
  private readyPromise: Promise<void>;
  private resolveReady: () => void;

  async init() {
    this.connection = amqp.connect(['amqp://guest:guest@rabbitmq:5672']);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) =>
        channel.assertQueue('transactions_queue', { durable: true }),
    });

    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.connection.on('connect', () => {
      console.log('RabbitMQ connected');
      this.resolveReady();
    });

    this.connection.on('disconnect', (err) => {
      console.error('RabbitMQ disconnected', err);
    });
  }

  async onModuleInit() {
    await this.init();
    console.log('RabbitMQ init done');
  }

  async sendToQueue(queue: string, message: any) {
    await this.readyPromise;
    await this.channelWrapper.sendToQueue(queue, message);
  }

  async addConsumer(queue: string, onMessage: (msg: any) => Promise<void>) {
    await this.readyPromise;

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
