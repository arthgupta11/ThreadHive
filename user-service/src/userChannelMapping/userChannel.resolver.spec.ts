import { Test, TestingModule } from '@nestjs/testing';

import { UserChannelService } from './userChannel.service';
import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserChannelInput } from './dtos/createUserChannelInput.dto';
import { UpdateUserChannelInput } from './dtos/updateUserChannelInput.dto';
import { DeleteUserChannelInput } from './dtos/deleteUserChannelInput.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserChannelResolver } from './userchannel.resolver';

// Mock Data
const mockUserChannelResponse = { id: BigInt(1), userId: BigInt(2), channelId: BigInt(3) };
const mockContext: AuthGaurdContextDto = {
  req: {},
  email: 'admin@example.com',
  role: 'SUPERADMIN',
  activityDone: 'createUser',
  userId: BigInt(5),
};

describe('UserChannelResolver', () => {
  let resolver: UserChannelResolver;
  let service: UserChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserChannelResolver,
        {
          provide: UserChannelService,
          useValue: {
            getUserChannelMapping: jest.fn().mockResolvedValue([mockUserChannelResponse]),
            createUserChannelMapping: jest.fn().mockResolvedValue('Created Successfully'),
            updateUserChannelMapping: jest.fn().mockResolvedValue('Updated Successfully'),
            deleteUserChannelMapping: jest.fn().mockResolvedValue('Deleted Successfully'),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Override AuthGuard to prevent actual authentication
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    resolver = module.get<UserChannelResolver>(UserChannelResolver);
    service = module.get<UserChannelService>(UserChannelService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should get user-channel mapping', async () => {
    const result = await resolver.getUserChannelMapping(mockContext);
    expect(result).toEqual([mockUserChannelResponse]);
    expect(service.getUserChannelMapping).toHaveBeenCalledWith(mockContext);
  });

  it('should create user-channel mapping', async () => {
    const input: CreateUserChannelInput = { id: BigInt(10), userId: BigInt(20), channelId: BigInt(30) };
    const result = await resolver.createUserChannelMapping(input, mockContext);
    
    expect(result).toBe('Created Successfully');
    expect(service.createUserChannelMapping).toHaveBeenCalledWith(input, mockContext);
  });

  it('should update user-channel mapping', async () => {
    const input: UpdateUserChannelInput = { id: BigInt(10), userId: BigInt(20) };
    const result = await resolver.updateUserChannelMapping(input, mockContext);

    expect(result).toBe('Updated Successfully');
    expect(service.updateUserChannelMapping).toHaveBeenCalledWith(input, mockContext);
  });

  it('should delete user-channel mapping', async () => {
    const input: DeleteUserChannelInput = { id: BigInt(10) };
    const result = await resolver.deleteUserChannelMapping(input, mockContext);

    expect(result).toBe('Deleted Successfully');
    expect(service.deleteUserChannelMapping).toHaveBeenCalledWith(input, mockContext);
  });

  it('should throw UnauthorizedException for non-admin users', async () => {
    const input: CreateUserChannelInput = { id: BigInt(10), userId: BigInt(20), channelId: BigInt(30) };
    const unauthorizedContext = { ...mockContext, role: 'USER' };

    await expect(resolver.createUserChannelMapping(input, unauthorizedContext)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
