import { Injectable } from '@nestjs/common';

import { CreateUserInput } from './dtos/createInput.dto';
import { DeleteUserInput } from './dtos/deleteInput.dto';
import { UserResponseDto } from './dtos/response.dto';
import { StatsUserInput } from './dtos/statsInput.dto';
import { StatsResponseDto } from './dtos/statsResponse.dto';
import { UpdateUserInput } from './dtos/updateInput.dto';
import { UserDao } from './user.dao';
import { userStatsDao } from './userStats.dao';
import { UserActivityDao } from 'database-service/dist';
import { UserActivityResponseDto } from 'database-service/dist/commonHelpers/activityResponse.dto';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userDao: UserDao,
    private readonly userStatsDao: userStatsDao,
    private readonly userActivityDao: UserActivityDao
  ) {} // Inject `UserDao`

  async createUser(input: CreateUserInput, context: AuthGaurdContextDto) {
    return this.userDao.createUserDao(input, context);
  }

  async findUserByEmail(email: string, context: AuthGaurdContextDto): Promise<UserResponseDto[]> {
    return this.userDao.findUserByEmailDao(email, context);
  }

  async getUserStats(input: StatsUserInput, context: AuthGaurdContextDto): Promise<StatsResponseDto[]> {
    return this.userStatsDao.getUserPostStats(input, context);
  }

  async getUsers(context: AuthGaurdContextDto): Promise<UserResponseDto[]> {
    return this.userDao.getUsersDao(context);
  }

  async getUserActivity(userId: bigint): Promise<UserActivityResponseDto[]> {
    return this.userActivityDao.getUserActivity(userId);
  }
  async addUserActivity(
    activity: string,
    actionBy: bigint,
    additionalData?: Record<string, any>
  ): Promise<boolean> {
    return this.userActivityDao.addUserActivity(
      activity,
      actionBy,
      additionalData
    );
  }

  async deleteUser(
    input: DeleteUserInput,
    role: string,
    context: AuthGaurdContextDto,
    channels?: bigint[]
    
  ): Promise<string> {
    return this.userDao.deleteUserDao(input, role,context, channels);
  }

  async updateUser(input: UpdateUserInput,context: AuthGaurdContextDto): Promise<string> {
    return this.userDao.updateUser(input, context);
  }
}
