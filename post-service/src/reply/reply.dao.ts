import { Injectable } from '@nestjs/common';
import { db, replies, UserActivityDao } from 'database-service-arth/dist';
import { eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { DeleteReplyInput } from './dtos/deleteReply.dto';
import { ReplyResponseDto } from './dtos/replyComment.dto';
import { UpdateReplyInput } from './dtos/updateReply.dto';

@Injectable()
export class ReplyDao {
  constructor(private readonly userActivityDao: UserActivityDao) {} // Inject `UserDao`

  async createReplyDao(
    input: typeof replies.$inferInsert,
    context: AuthGaurdContextDto
  ) {
    try {
      const newReply = await db.insert(replies).values(input); // .returning() returns inserted row(s)
      if (newReply[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          {
            ...input,
            commentId: input.channelId.toString(),
            createdBy: input.createdBy.toString(),
            modifiedBy: input.modifiedBy.toString(),
            channelId: input.channelId.toString(),
            postId: input.postId.toString(),
          }
        );
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted Reply
    } catch (error) {
      throw new Error(`Database error -> ${error}`);
    }
  }

  async getRepliesDao(
    context: AuthGaurdContextDto
  ): Promise<ReplyResponseDto[]> {
    try {
      const response =
        (await db.query.replies.findMany()) as ReplyResponseDto[];

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

  async deleteReplyDao(
    input: DeleteReplyInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id } = input;
      const response = await db.delete(replies).where(eq(replies.id, id));

      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { id: id.toString() }
        );
        return `Reply with if ${id} deleted successfully`;
      }
      throw new Error(`Reply id not found -> ${id}`);
    } catch (error) {
      throw new Error(`error in db with mesage -> ${error}`);
    }
  }

  async updateReply(
    input: UpdateReplyInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    try {
      const { id, description, channelId, postId, modifiedBy } = input;
      const Reply = await db
        .select()
        .from(replies)
        .where(eq(replies.id, id))
        .limit(1);

      if (!Reply) {
        throw new Error(`Reply with id ${id} not found`);
      }
      const updatedData: Partial<UpdateReplyInput> = {};
      // Update only the fields that were provided in the input
      if (postId !== undefined) {
        updatedData.postId = postId;
      }
      if (description !== undefined) {
        updatedData.description = description;
      }
      if (channelId !== undefined) {
        updatedData.channelId = channelId;
      } // If password is provided, hash it
      updatedData.modifiedBy = modifiedBy;
      updatedData.modifiedAt = new Date();

      // Save the updated Reply
      const response = await db
        .update(replies)
        .set(updatedData)
        .where(eq(replies.id, id));
      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          {
            ...input,
            id: id.toString(),
            modifiedBy: modifiedBy.toString(),
            channelId: channelId.toString(),
            commentId: input.commentId.toString(),
            postId: postId.toString(),
          }
        );
        return `Reply of id  ${input.id} updated successfully`;
      }
      throw new Error(`Reply of id ${id} not updated`);
    } catch (error) {
      throw new Error(`database error : ${error}`);
    }
  }

  async canUserProceed(
    entityId: bigint,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string
  ): Promise<boolean> {
    if (role === 'SUPERADMIN') {
      return true;
    }
    const record = await db.query.replies.findFirst({
      where: (replies, { eq }) => {
        return eq(replies.id, entityId);
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
}
