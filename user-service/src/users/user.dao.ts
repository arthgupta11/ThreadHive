import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  db,
  UserActivityDao,
  users,
  usersChannelMapping,
} from 'database-service-arth/dist'; // Ensure correct import
import { eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserInput } from './dtos/createInput.dto';
import { DeleteUserInput } from './dtos/deleteInput.dto';
import { UserResponseDto } from './dtos/response.dto';
import { UpdateUserInput } from './dtos/updateInput.dto';

@Injectable()
export class UserDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}
  async createUserDao (input: CreateUserInput, context: AuthGaurdContextDto) {
  
    try {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const dataObject = {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        dob: input.dob,
        createdAt: new Date(),
        isDeleted: false,
      };
      const newUser = await db.insert(users).values(dataObject); // .returning() returns inserted row(s)
      if (newUser[0].affectedRows !== 0) {
        console.log(context.activityDone);
        this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          dataObject
        );
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted user
    } catch (error) {
      console.log(error);
      throw new Error(`Database error -> ${error}`);
    }
  }

  async findUserByEmailDao (
    email: string,
    context: AuthGaurdContextDto
  ): Promise<UserResponseDto[]> {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      console.log(user);
      await this.userActivityDao.addUserActivity(
        context.activityDone,
        context.userId,
        user[0]
      );
      return user as UserResponseDto[];
    } catch (error) {
      console.log('error-->', error);
      throw new Error('Database error !');
    }
  }

  async getUsersDao (context: AuthGaurdContextDto): Promise<UserResponseDto[]> {
    try {
      const response = (await db.query.users.findMany()) as UserResponseDto[];
      await this.userActivityDao.addUserActivity(
        context.activityDone,
        context.userId,
        { request: 'success' }
      );
      return response;
    } catch (error) {
      
      throw new Error(`Database error -> ${error}`);
    }
  }

  async deleteUserDao (
    input: DeleteUserInput,
    role: string,
    context: AuthGaurdContextDto,
    channels?: bigint[]
  ): Promise<string> {
    const { id } = input;
    const userChannel = await db
      .select({ channelId: usersChannelMapping.channelId })
      .from(usersChannelMapping)
      .where(eq(usersChannelMapping.userId, id));
    const userBelongsToChannel = userChannel[0]?.channelId;
    if (role === 'ADMIN' && !channels?.includes(userBelongsToChannel)) {
      throw new UnauthorizedException(
        `You dont have rights to this channel of id ${userBelongsToChannel}`
      );
    } else {
      try {
        const response = await db.delete(users).where(eq(users.id, id));
        // const response = [{'affectedRows':1}]
        console.log(input);
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { id: id.toString() }
        );
        console.log(response);

        if (response[0].affectedRows !== 0) {
          return `user with id ${id} deleted successfully`;
        }
        throw new Error(`user id not found -> ${id}`);
      } catch (error) {
        throw new Error(`error in db with mesage -> ${error}`);
      }
    }
  }

  async updateUser (
    input: UpdateUserInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id, name, email, password, role, dob } = input;
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      const updatedData: Partial<UpdateUserInput> = {};
      // Update only the fields that were provided in the input
      if (name !== undefined) {
        updatedData.name = name;
      }
      if (email !== undefined) {
        updatedData.email = email;
      }
      if (password !== undefined) {
        updatedData.password = await bcrypt.hash(password, 10);
      } // If password is provided, hash it
      if (role !== undefined) {
        updatedData.role = role;
      }
      if (dob !== undefined) {
        updatedData.dob = dob;
      }
      updatedData.modifiedAt = new Date();

      // Save the updated user
      const response = await db
        .update(users)
        .set(updatedData)
        .where(eq(users.id, id));
      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { ...input, id: id.toString() }
        );
        return `user of id  ${input.id} updated successfully`;
      }
      throw new Error(`user of id ${id} not updated`);
    } catch (error) {
      throw new Error(`database error -> ${error}`);
    }
  }
}
