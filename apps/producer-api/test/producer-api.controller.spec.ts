import { RabbitMQService } from "@app/rabbitmq"
import { ProducerApiController } from "../src/producer-api.controller"
import { Test, TestingModule } from "@nestjs/testing"

describe('ProducerAPICOntroller', () => {
    let controller: ProducerApiController;
    let rabbitMQService: RabbitMQService;

    const mockRabbitMQService = {
        sendToQueue: jest.fn()
    }

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProducerApiController],
            providers: [
                {
                    provide: RabbitMQService,
                    useValue: mockRabbitMQService
                }
            ]
        }).compile();

        controller = module.get<ProducerApiController>(ProducerApiController);
        rabbitMQService = module.get<RabbitMQService>(RabbitMQService)
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('should call sendToQueue with correct data and return status message', async() => {
        const body = {amount: 100};
        const result = await controller.createTransaction(body);
        expect(mockRabbitMQService.sendToQueue).toHaveBeenCalledWith(
            'transactions_queue',
            body
        );
        expect(result).toEqual({ status: 'Transaction sent to queue'})
    })
});