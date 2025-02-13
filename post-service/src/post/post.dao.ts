import { Injectable } from '@nestjs/common';
import { db, posts, UserActivityDao } from 'database-service-arth/dist';
import { eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { DeletePostInput } from './dtos/deletePostInput.dto';
import { PostResponseDto } from './dtos/postResponse.dto';
import { UpdatePostInput } from './dtos/updatePostInput.dto';

@Injectable()
export class PostDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}
  async createPostDao (
    input: typeof posts.$inferInsert,
    context: AuthGaurdContextDto
  ) {

    try {
      const newpost = await db.insert(posts).values(input); // .returning() returns inserted row(s)
      if (newpost[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          {
            ...input,
            createdBy: input.createdBy.toString(),
            modifiedBy: input.modifiedBy.toString(),
            channelId: input.channelId.toString(),

          }
        );
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted post
    } catch (error) {

      throw new Error(`Database error -> ${error}`);
    }
  }

  async getPostsDao (context: AuthGaurdContextDto): Promise<PostResponseDto[]> {
    try {
      const response = await db.select().from(posts);

      await this.userActivityDao.addUserActivity(
        context.activityDone,
        context.userId,
        { request: 'success' }
      );
      return response as PostResponseDto[];
    } catch (error) {
      throw new Error(`Database error -> ${error}`);
    }
  }

  async deletePostDao (
    input: DeletePostInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id } = input;
      const response = await db.delete(posts).where(eq(posts.id, id));

      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { id: input.id.toString() }
        );
        return `post with id ${id} deleted successfully`;
      }
      throw new Error(`post id not found -> ${id}`);
    } catch (error) {
      throw new Error(`error in db with mesage -> ${error}`);
    }
  }

  async canUserProceed (
    entityId: bigint,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string
  ): Promise<boolean> {
    if (role === 'SUPERADMIN') {
      return true;
    }
    const record = await db.query.posts.findFirst({
      where: (posts, { eq }) => {
        return eq(posts.id, entityId);
      },
    });
    if (record) {
      if (role === 'ADMIN') {
        return channelsAllowed.includes(record.channelId);
      }
      return record.createdBy.toString() === userId.toString();
    }
    return false;
  }

  async updatePost (
    input: UpdatePostInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id, title, description, channelId, modifiedBy } = input;
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);

      if (!post) {
        throw new Error(`post with id ${id} not found`);
      }
      const updatedData: Partial<UpdatePostInput> = {};
      // Update only the fields that were provided in the input
      if (title !== undefined) {
        updatedData.title = title;
      }
      if (description !== undefined) {
        updatedData.description = description;
      }
      if (channelId !== undefined) {
        updatedData.channelId = channelId;
      } // If password is provided, hash it
      updatedData.modifiedBy = modifiedBy;
      updatedData.modifiedAt = new Date();

      // Save the updated post
      const response = await db
        .update(posts)
        .set(updatedData)
        .where(eq(posts.id, id));
      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { ...input, id: id.toString() }
        );
        return `post of id  ${input.id} updated successfully`;
      }
      throw new Error(`post of id ${id} not updated`);
    } catch (error) {
      throw new Error(`database error: ${error}`);
    }
  }
}
