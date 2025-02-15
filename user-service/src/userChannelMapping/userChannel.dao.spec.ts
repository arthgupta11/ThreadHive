import { UserChannelDao } from './userChannel.dao';
import { UserActivityDao, USERROLE } from 'database-service-arth/dist'; // Ensure correct import

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserChannelInput } from './dtos/createUserChannelInput.dto';
import { bigint } from 'drizzle-orm/pg-core';




//everytime you need to change ids currently its 19 for user

describe('UserChannelDao', () => {
  let userChannelDao: UserChannelDao;
  let userActivityDao: UserActivityDao;


  beforeEach(() => {
    userActivityDao = new UserActivityDao();
    userChannelDao = new UserChannelDao(userActivityDao);
    

    // Mock addUserActivity function
    jest.spyOn(userActivityDao, 'addUserActivity').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should create a userchannel mapping successfully', async () => {
    // Arrange
    const input: CreateUserChannelInput = {
       id: BigInt(24),
       userId: BigInt(21),
      channelId: BigInt(9),
    };

    const context: AuthGaurdContextDto = {
      req: {},
      email: 'trump@gmail.com',
      role: USERROLE.SUPERADMIN,
      activityDone: 'createUser',
      userId: BigInt(5),
    };

    // Act
    const result = await userChannelDao.createUserChannelMapppingDao(input, context);

    // Assert
    expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
      context.activityDone,
      context.userId,
      expect.any(Object)
    );

    expect(result).toBe('ok done with status 200');
  });
    
      it('should update a user mapping successfully', async () => {
        const input = { id: BigInt(6), userId: BigInt(21), name: 'Updated Name' };
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'trump@gmail.com',
          role: 'SUPERADMIN',
          activityDone: 'updateUser',
          userId: BigInt(5),
        };
    
        
        const result = await userChannelDao.updateUserChannel(input, context);
    
        expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
          context.activityDone,
          context.userId,
          expect.any(Object)
      );
        expect(result).toBe('user mapping of id  6 updated successfully');
      });
    
      it('should throw an error when updating a non-existent user', async () => {
        const input = { id: BigInt(99), name: 'Nonexistent User' };
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'updateUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'select').mockResolvedValue([]);
        
        await expect(userChannelDao.updateUserChannel(input, context)).rejects.toThrow(
          'database error->  Error: user of id 99 not updated'
        );
      });

      it('should throw an error when deleting a non-existent user channel mapping', async () => {
        const input = { id: BigInt(99), name: 'Nonexistent User' };
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'updateUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'select').mockResolvedValue([]);
        
        await expect(userChannelDao.deleteUserChannelDao(input, context)).rejects.toThrow(
          'error in db with mesage -> Error: user id not found -> 99'
        );
      });

      it('should delete a user successfully', async () => {
        const input = { id: BigInt(24) };
        const role = 'SUPERADMIN';
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'deleteUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'delete').mockResolvedValue([{ affectedRows: 1 }]);
    
        const result = await userChannelDao.deleteUserChannelDao(input, context);
        
        expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
          context.activityDone,
          context.userId,
          { id: '24' }
        );
        expect(result).toBe('user mapping with id 24 deleted successfully');
      });
});

