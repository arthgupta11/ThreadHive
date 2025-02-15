import { UserDao } from './user.dao';
import { UserActivityDao, USERROLE } from 'database-service-arth/dist'; // Ensure correct import
import * as bcrypt from 'bcryptjs';
import { db, users } from 'database-service-arth/dist';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserInput } from './dtos/createInput.dto';
import { UserResponseDto } from './dtos/response.dto';
import { UsersResolver } from './user.resolver';



//everytime you need to change ids currently its 19 for user

describe('UserDao', () => {
  let userDao: UserDao;
  let userActivityDao: UserActivityDao;


  beforeEach(() => {
    userActivityDao = new UserActivityDao();
    userDao = new UserDao(userActivityDao);
    

    // Mock addUserActivity function
    jest.spyOn(userActivityDao, 'addUserActivity').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should create a user successfully', async () => {
    // Arrange
    const input: CreateUserInput = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: USERROLE.USER,
      dob: new Date('2000-01-01'),
    };

    const context: AuthGaurdContextDto = {
      req: {},
      email: 'trump@gmail.com',
      role: USERROLE.SUPERADMIN,
      activityDone: 'createUser',
      userId: BigInt(5),
    };

    // Act
    const result = await userDao.createUserDao(input, context);

    // Assert
    expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
      context.activityDone,
      context.userId,
      expect.any(Object)
    );

    expect(result).toBe('ok done with status 200');
  });

    it('should find a user by email', async () => {
    // Arrange
    const email = 'test@example.com';
   
    const context: AuthGaurdContextDto = {
      req: {},
      email: 'trump@gmail.com',
      role: USERROLE.SUPERADMIN,
      activityDone: 'getUsers',
      userId: BigInt('5'),
    };
    // Act
    const result = await userDao.findUserByEmailDao(email, context);

    // Assert
    expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
      context.activityDone,
      context.userId,
      expect.any(Object)

    );
    expect(result).toEqual([
        expect.objectContaining({
          id: BigInt(19),
          name: 'Test User',
          email: 'test@example.com',
        }),
      ]);
  });

  it('should handle errors when fetching a user by email', async () => {
        // Arrange
        const email = 'zimzam@gmail.com';
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'zimzam@gmail.com',
          role: USERROLE.SUPERADMIN,
          activityDone: 'getUsersByEmail',
          userId: BigInt('5'),
        };
    
        // Act & Assert
        await expect(userDao.findUserByEmailDao(email, context)).rejects.toThrow(
          'Database error !'
        );
      });
    
      it('should throw an error when deleting a non-existent user', async () => {
        const input = { id: BigInt(99) };
        const role = 'SUPERADMIN';
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'deleteUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'delete').mockResolvedValue([{ affectedRows: 0 }]);
    
        await expect(userDao.deleteUserDao(input, role, context)).rejects.toThrow(
          'user id not found -> 99'
        );
      });
    
      it('should update a user successfully', async () => {
        const input = { id: BigInt(19), name: 'Updated Name' };
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'updateUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'select').mockResolvedValue([{ id: BigInt(17), name: 'Old Name' }]);
        // jest.spyOn(db, 'update').mockResolvedValue([{ affectedRows: 1 }]);
    
        const result = await userDao.updateUser(input, context);
    
        expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
          context.activityDone,
          context.userId,
          expect.objectContaining({ id: '19', name: 'Updated Name' })
        );
        expect(result).toBe('user of id  19 updated successfully');
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
        
        await expect(userDao.updateUser(input, context)).rejects.toThrow(
          'database error -> Error: user of id 99 not updated'
        );
      });

      it('should delete a user successfully', async () => {
        const input = { id: BigInt(19) };
        const role = 'SUPERADMIN';
        const context: AuthGaurdContextDto = {
          req: {},
          email: 'admin@example.com',
          role: 'SUPERADMIN',
          activityDone: 'deleteUser',
          userId: BigInt(5),
        };
    
        // jest.spyOn(db, 'delete').mockResolvedValue([{ affectedRows: 1 }]);
    
        const result = await userDao.deleteUserDao(input, role, context);
        
        expect(userActivityDao.addUserActivity).toHaveBeenCalledWith(
          context.activityDone,
          context.userId,
          { id: '19' }
        );
        expect(result).toBe('user with id 19 deleted successfully');
      });
});

