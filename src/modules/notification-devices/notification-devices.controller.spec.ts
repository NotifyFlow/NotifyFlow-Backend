import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDevicesController } from './notification-devices.controller';

describe('NotificationDevicesController', () => {
  let controller: NotificationDevicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationDevicesController],
    }).compile();

    controller = module.get<NotificationDevicesController>(NotificationDevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
