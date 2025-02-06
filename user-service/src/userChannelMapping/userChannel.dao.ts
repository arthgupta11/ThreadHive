import { db, usersChannelMapping } from 'database-service/dist';
import { eq } from 'drizzle-orm';
// Ensure correct import
import { CreateUserChannelInput } from './dtos/createUserChannelInput.dto';
import { DeleteUserChannelInput } from './dtos/deleteUserChannelInput.dto';
import { UserChannelResponseDto } from './dtos/responseUserChannel.dto';
import { UpdateUserChannelInput } from './dtos/updateUserChannelInput.dto';

export class UserChannelDao {
  async createUserChannelMapppingDao (input: CreateUserChannelInput) {
    try {
      const dataObject = {
        userId: input.userId,
        channelId: input.channelId,
      };
      const newUser = await db.insert(usersChannelMapping).values(dataObject); // .returning() returns inserted row(s)
      if (newUser[0].affectedRows !== 0) {
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted user
    } catch (error) {
      console.log(error);
      throw new Error('Database error !');
    }
  }

  async getUsersChannelDao (): Promise<UserChannelResponseDto[]> {
    try {
      const response = (await db
        .select()
        .from(usersChannelMapping)) as UserChannelResponseDto[];
      return response;
    } catch (error) {
      console.log('error-->', error);
      throw new Error('Database error !');
    }
  }

  async deleteUserChannelDao (input: DeleteUserChannelInput): Promise<string> {
    try {
      const { id } = input;
      const response = await db
        .delete(usersChannelMapping)
        .where(eq(usersChannelMapping.id, id));
      console.log(response);

      if (response[0].affectedRows !== 0) {
        return `user mapping with if ${id} deleted successfully`;
      }
      throw new Error(`user id not found -> ${id}`);
    } catch (error) {
      throw new Error(`error in db with mesage -> ${error}`);
    }
  }

  async updateUserChannel (input: UpdateUserChannelInput): Promise<string> {
    try {
      const { id, userId, channelId } = input;
      const user = await db
        .select()
        .from(usersChannelMapping)
        .where(eq(usersChannelMapping.id, id))
        .limit(1);

      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      const updatedData: Partial<UpdateUserChannelInput> = {};
      // Update only the fields that were provided in the input
      if (userId !== undefined) {
        updatedData.userId = userId;
      }
      if (channelId !== undefined) {
        updatedData.channelId = channelId;
      }
      updatedData.modifiedAt = new Date();

      // Save the updated user
      const response = await db
        .update(usersChannelMapping)
        .set(updatedData)
        .where(eq(usersChannelMapping.id, id));
      if (response[0].affectedRows !== 0) {
        return `user mapping of id  ${input.id} updated successfully`;
      }
      throw new Error(`user of id ${id} not updated`);
    } catch (error) {
      throw new Error('database error-> {error');
    }
  }
}
