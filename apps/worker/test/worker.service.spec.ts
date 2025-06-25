import { RabbitMQService } from '@app/rabbitmq';
import { WorkerService } from '../src/worker.service';
import { TestingModule, Test } from '@nestjs/testing';

describe('WorkerService', () => {
  let service: WorkerService;

  const mockRabbitMQService = {
    addConsumer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a consumer on module init', async () => {
    {
      await service.onModuleInit();

      expect(mockRabbitMQService.addConsumer).toHaveBeenCalledWith(
        'transactions_queue',
        expect.any(Function),
      );
    }
  });

  it('should process the transaction and log cashback', async () => {
    const mockTransaction = { amount: 200 };

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await service.onModuleInit();

    const [[, consumerFn]] = mockRabbitMQService.addConsumer.mock.calls;

    await consumerFn(mockTransaction);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Processing transaction:',
      mockTransaction,
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Transaction processed: cashback = \d+\.\d{2}/),
    );

    consoleLogSpy.mockRestore();
  });
});
