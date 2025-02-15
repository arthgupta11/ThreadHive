import { Test, TestingModule } from '@nestjs/testing';
import { RepliesResolver } from './reply.resolver';
import { RepliesService } from './reply.service';
import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateReplyInput } from './dtos/createReply.dto';
import { UpdateReplyInput } from './dtos/updateReply.dto';
import { DeleteReplyInput } from './dtos/deleteReply.dto';
import { ReplyResponseDto } from './dtos/replyComment.dto';
import { UnauthorizedException } from '@nestjs/common';

// Mock Data
const mockReplyResponse: ReplyResponseDto = {
  id: BigInt(111),
  description: 'This is a test reply with more than 10 characters.',
  createdBy: BigInt(2),
  modifiedBy: BigInt(2),
  channelId: BigInt(3),
  commentId: BigInt(4),
  postId: BigInt(5),
  createdAt: new Date(),
  isDeleted: false,
};

const mockContext: AuthGaurdContextDto = {
  req: {},
  email: 'admin@example.com',
  role: 'ADMIN',
  activityDone: 'createReply',
  userId: BigInt(2),
  channelsAllowed: [BigInt(3)], // User has access to channel 3
};

describe('RepliesResolver', () => {
  let resolver: RepliesResolver;
  let service: RepliesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepliesResolver,
        {
          provide: RepliesService,
          useValue: {
            getReplies: jest.fn().mockResolvedValue([mockReplyResponse]),
            createReply: jest.fn().mockResolvedValue('Reply Created'),
            updateReply: jest.fn().mockResolvedValue('Reply Updated'),
            deleteReply: jest.fn().mockResolvedValue('Reply Deleted'),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Override AuthGuard to allow all requests
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    resolver = module.get<RepliesResolver>(RepliesResolver);
    service = module.get<RepliesService>(RepliesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get replies', async () => {
    const result = await resolver.getReplies(mockContext);
    expect(result).toEqual([mockReplyResponse]);
    expect(service.getReplies).toHaveBeenCalledWith(mockContext);
  });

  it('should create a reply', async () => {
    const input: CreateReplyInput = {
      description: 'This is a new reply with enough characters.',
      createdBy: BigInt(2),
      channelId: BigInt(3),
      commentId: BigInt(4),
      postId: BigInt(5),
    };
    const result = await resolver.createReply(input, mockContext);

    expect(result).toBe('Reply Created');
    expect(service.createReply).toHaveBeenCalledWith(input, mockContext);
  });

  it('should throw UnauthorizedException for unauthorized channels', async () => {
    const input: CreateReplyInput = {
      description: 'This is a test reply with enough characters.',
      createdBy: BigInt(2),
      channelId: BigInt(99), // Not in channelsAllowed
      commentId: BigInt(4),
      postId: BigInt(5),
    };

    await expect(resolver.createReply(input, mockContext)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should update a reply', async () => {
    const input: UpdateReplyInput = {
      id: BigInt(111),
      modifiedBy: BigInt(2),
      description: 'Updated reply with more than 10 characters.',
      channelId: BigInt(3),
      commentId: BigInt(4),
      postId: BigInt(5),
      modifiedAt: new Date(),
    };
    const result = await resolver.updateReply(input, mockContext);

    expect(result).toBe('Reply Updated');
    expect(service.updateReply).toHaveBeenCalledWith(
      input,
      mockContext.channelsAllowed,
      mockContext.userId,
      mockContext.role,
      mockContext
    );
  });

  it('should delete a reply', async () => {
    const input: DeleteReplyInput = {
      id: BigInt(111),
    };
    const result = await resolver.deleteReply(input, mockContext);

    expect(result).toBe('Reply Deleted');
    expect(service.deleteReply).toHaveBeenCalledWith(
      input,
      mockContext.channelsAllowed,
      mockContext.userId,
      mockContext.role,
      mockContext
    );
  });
});
