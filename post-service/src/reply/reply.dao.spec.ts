import { Test, TestingModule } from '@nestjs/testing';
import { db, replies, UserActivityDao } from 'database-service-arth/dist';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { DeleteReplyInput } from './dtos/deleteReply.dto';
import { UpdateReplyInput } from './dtos/updateReply.dto';
import { ReplyDao } from './reply.dao';
import { ReplyResponseDto } from './dtos/replyComment.dto';

describe('ReplyDao', () => {
  let replyDao: ReplyDao;
  let userActivityDao: UserActivityDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyDao, UserActivityDao],
    }).compile();
    replyDao = module.get<ReplyDao>(ReplyDao);
    userActivityDao = module.get<UserActivityDao>(UserActivityDao);

    userActivityDao.addUserActivity = jest.fn();
  });

  it('should be defined', () => {
    expect(replyDao).toBeDefined();
  });

  describe('createReplyDao', () => {
    it('should create a reply and add user activity', async () => {
      const input = {
        id: BigInt(111),
        description: 'Test reply',
        createdBy: BigInt(5),
        channelId: BigInt(9),
        commentId: BigInt(3),
        postId: BigInt(6),
        createdAt: new Date(),
        isDeleted: false,
        modifiedBy: BigInt(5),
      };
      const context: AuthGaurdContextDto = {
        activityDone: 'CREATE_REPLY',
        userId: BigInt(5),
        req:{},
        role:'SUPERADMIN',
        email: 'trumps@gmail.com',
      };

      const result = await replyDao.createReplyDao(input, context);
      expect(result).toEqual('ok done with status 200');
      expect(userActivityDao.addUserActivity).toHaveBeenCalled(
        
      );
    });
  });



describe('getRepliesDao', () => {
    it('should return replies and add user activity', async () => {
      const context: AuthGaurdContextDto = {
        activityDone: 'GET_REPLIES',
        userId: BigInt(1),
        req: {},
        role: 'SUPERADMIN',
        email: 'trumps@gmail.com',
      };
  
      const result = await replyDao.getRepliesDao(context);
  
      // Validate that result contains objects matching the shape of ReplyResponseDto
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(BigInt),
            description: expect.any(String),
          }),
        ])
      );
  
      expect(userActivityDao.addUserActivity).toHaveBeenCalled();
    });
  });
  
  

  describe('updateReply', () => {
    it('should update a reply and add user activity', async () => {
      const input: UpdateReplyInput = {
        id: BigInt(111),
        description: 'Updated',
        modifiedBy: BigInt(5),
        channelId: BigInt(9),
        commentId: BigInt(3),
        postId: BigInt(6),
        modifiedAt: new Date(),
      };
      const context: AuthGaurdContextDto = {
        activityDone: 'updateReply',
        userId: BigInt(5),
        req:{},
        role:'SUPERADMIN',
        email: 'trumps@gmail.com',
      };
      const result = await replyDao.updateReply(input, context);
      expect(result).toEqual('Reply of id  111 updated successfully');
      expect(userActivityDao.addUserActivity).toHaveBeenCalled();
    });
  });

  describe('canUserProceed', () => {
    it('should allow SUPERADMIN to proceed', async () => {
      const result = await replyDao.canUserProceed(1n, [1n], 1n, 'SUPERADMIN');
      expect(result).toBe(true);
    });

    it('should allow ADMIN if channel is allowed', async () => {
      const result = await replyDao.canUserProceed(1n, [9n], 11n, 'ADMIN');
      expect(result).toBe(true);
    });

    it('should allow USER if they created the reply', async () => {
      const result = await replyDao.canUserProceed(3n, [9n], 14n, 'USER');
      expect(result).toBe(true);
    });

    it('should deny access if conditions are not met', async () => {
      const result = await replyDao.canUserProceed(3n, [9n], 13n, 'USER');
      expect(result).toBe(false);
    });
  });

  describe('deleteReplyDao', () => {
    it('should delete a reply and add user activity', async () => {
      const input: DeleteReplyInput = { id: BigInt(111) };
      const context: AuthGaurdContextDto = {
        activityDone: 'deleteReply',
        userId: BigInt(5),
        req:{},
        role:'SUPERADMIN',
        email: 'trumps@gmail.com',
      };

      const result = await replyDao.deleteReplyDao(input, context);
      expect(result).toEqual('Reply with id 111 deleted successfully');
      expect(userActivityDao.addUserActivity).toHaveBeenCalled();
    });
  });

});
