import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDevicesService } from './notification-devices.service';

describe('NotificationDevicesService', () => {
  let service: NotificationDevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationDevicesService],
    }).compile();

    service = module.get<NotificationDevicesService>(NotificationDevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
