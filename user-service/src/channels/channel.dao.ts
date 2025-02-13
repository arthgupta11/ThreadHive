import { Injectable } from '@nestjs/common';
import { channels, db,UserActivityDao } from 'database-service-arth/dist';
import { eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { ChannelResponseDto } from './dtos/channelResponse.dto';
import { CreateChannelInput } from './dtos/createChannelInput.dto';
import { DeleteChannelInput } from './dtos/deleteChannelInput.dto';
import { UpdateChannelInput } from './dtos/updateChannelInput.dto';

@Injectable()
export class ChannelDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}
  formatDateForMySQL (dateString: string): string {
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  async createChannelDao (
    input: CreateChannelInput,
    context: AuthGaurdContextDto
  ) {
    console.log('in create block');
    try {
      const dataObject = {
        name: input.name,
        createdAt: new Date(),
        isDeleted: false,
      };
      const newChannel = await db.insert(channels).values(dataObject); // .returning() returns inserted row(s)
      if (newChannel[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          dataObject
        );
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted channel
    } catch (error) {
      console.log(error);
      throw new Error('Database error !');
    }
  }

  async getChannelsDao (
    context: AuthGaurdContextDto
  ): Promise<ChannelResponseDto[]> {
    try {
      const response = (await db.query.channels.findMany()) as ChannelResponseDto[];
      await this.userActivityDao.addUserActivity(
        context.activityDone,
        context.userId,
        { request: 'success' }
      );
      return response;
    } catch (error) {
      console.log('error-->', error);
      throw new Error('Database error !');
    }
  }

  async deleteChannelDao (
    input: DeleteChannelInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id } = input;
      const response = await db.delete(channels).where(eq(channels.id, id));
      console.log(response);

      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { id: id.toString() }
        );
        return `channel with id ${id} deleted successfully`;
      }
      throw new Error(`channel id not found -> ${id}`);
    } catch (error) {
      throw new Error(`error in db with mesage -> ${error}`);
    }
  }

  async updateChannel (
    input: UpdateChannelInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id, name } = input;
      const channel = await db
        .select()
        .from(channels)
        .where(eq(channels.id, id))
        .limit(1);

      if (!channel) {
        throw new Error(`channel with id ${id} not found`);
      }
      const updatedData: Partial<UpdateChannelInput> = {};
      // Update only the fields that were provided in the input
      if (name !== undefined) {
        updatedData.name = name;
      }
      updatedData.modifiedAt = new Date();

      // Save the updated channel
      const response = await db
        .update(channels)
        .set(updatedData)
        .where(eq(channels.id, id));
      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { ...input, id: id.toString() }
        );
        return `channel of id  ${input.id} updated successfully`;
      }
      throw new Error(`channel of id ${id} not updated`);
    } catch (error) {
      throw new Error(`database error-> ${error}`);
    }
  }
}
