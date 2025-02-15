import { Test, TestingModule } from '@nestjs/testing';

import { ChannelsService } from './channel.service';
import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { UnauthorizedException } from '@nestjs/common';
import { CreateChannelInput } from './dtos/createChannelInput.dto';
import { UpdateChannelInput } from './dtos/updateChannelInput.dto';
import { DeleteChannelInput } from './dtos/deleteChannelInput.dto';
import { ChannelsResolver } from './channel.resolver';

// Mock Data
const mockChannelResponse = { id: BigInt(1), name: 'Tech Channel' };
const mockContext: AuthGaurdContextDto = {
  req: {},
  email: 'admin@example.com',
  role: 'SUPERADMIN',
  activityDone: 'createChannel',
  userId: BigInt(5),
};

describe('ChannelsResolver', () => {
  let resolver: ChannelsResolver;
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsResolver,
        {
          provide: ChannelsService,
          useValue: {
            getChannel: jest.fn().mockResolvedValue([mockChannelResponse]),
            createChannel: jest.fn().mockResolvedValue('Created Successfully'),
            updateChannel: jest.fn().mockResolvedValue('Updated Successfully'),
            deleteChannel: jest.fn().mockResolvedValue('Deleted Successfully'),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Override AuthGuard to bypass authentication
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    resolver = module.get<ChannelsResolver>(ChannelsResolver);
    service = module.get<ChannelsService>(ChannelsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should get channels', async () => {
    const result = await resolver.getChannels(mockContext);
    expect(result).toEqual([mockChannelResponse]);
    expect(service.getChannel).toHaveBeenCalledWith(mockContext);
  });

  it('should create a channel', async () => {
    const input: CreateChannelInput = { id: BigInt(10), name: 'Gaming Channel' };
    const result = await resolver.createChannel(input, mockContext);
    
    expect(result).toBe('Created Successfully');
    expect(service.createChannel).toHaveBeenCalledWith(input, mockContext);
  });

  it('should update a channel', async () => {
    const input: UpdateChannelInput = { id: BigInt(10), name: 'Updated Channel' };
    const result = await resolver.updateChannel(input, mockContext);
    
    expect(result).toBe('Updated Successfully');
    expect(service.updateChannel).toHaveBeenCalledWith(input, mockContext);
  });

  it('should delete a channel', async () => {
    const input: DeleteChannelInput = { id: BigInt(10) };
    const result = await resolver.deleteChannel(input, mockContext);
    
    expect(result).toBe('Deleted Successfully');
    expect(service.deleteChannel).toHaveBeenCalledWith(input, mockContext);
  });

  it('should throw UnauthorizedException for non-superadmin users', async () => {
    const input: CreateChannelInput = { id: BigInt(10), name: 'Unauthorized Channel' };
    const unauthorizedContext = { ...mockContext, role: 'USER' };

    await expect(resolver.createChannel(input, unauthorizedContext)).rejects.toThrow(UnauthorizedException);
  });
  
});
