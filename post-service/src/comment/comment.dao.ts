import { Injectable } from '@nestjs/common';
import { comments, db, UserActivityDao } from 'database-service-arth/dist';
import { eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CommentResponseDto } from './dtos/commentResponse.dto';
import { DeleteCommentInput } from './dtos/deleteCommentInput.dto';
import { UpdateCommentInput } from './dtos/updateComment.dto';

@Injectable()
export class CommentDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}
  async createCommentDao (input: typeof comments.$inferInsert,context: AuthGaurdContextDto) {

    try {
      const newComment = await db.insert(comments).values(input); // .returning() returns inserted row(s)
      if (newComment[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          {
            ...input,
            createdBy: input.createdBy.toString(),
            postId: input.postId.toString(),
            modifiedBy: input.modifiedBy.toString(),
            channelId: input.channelId.toString(),

          }
        );
        return 'ok done with status 200';
      }
      throw new Error('Check your data');

      // Return the first inserted Comment
    } catch (error) {
      throw new Error(`Database error -> ${error}`);
    }
  }

  async getCommentsDao (context: AuthGaurdContextDto): Promise<CommentResponseDto[]> {
    try {
      const response =
        (await db.query.comments.findMany()) as CommentResponseDto[];
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { 'request': 'success' }
        );
      return response;
    } catch (error) {

      throw new Error(`Database error -> ${error}`);
    }
  }

  async deleteCommentDao (input: DeleteCommentInput,context: AuthGaurdContextDto): Promise<string> {
    try {
      const { id } = input;
      const response = await db.delete(comments).where(eq(comments.id, id));

      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { 'id':id.toString() }
        );
        return `Comment with if ${id} deleted successfully`;
      }
      throw new Error(`Comment id not found -> ${id}`);
    } catch (error) {
      throw new Error(`error in db with mesage -> ${error}`);
    }
  }

  async updateComment (input: UpdateCommentInput,context: AuthGaurdContextDto): Promise<string> {
    try {
      const { id, description, channelId, postId, modifiedBy } = input;
      const Comment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, id))
        .limit(1);

      if (!Comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      const updatedData: Partial<UpdateCommentInput> = {};
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

      // Save the updated Comment
      const response = await db
        .update(comments)
        .set(updatedData)
        .where(eq(comments.id, id));
      if (response[0].affectedRows !== 0) {
        await this.userActivityDao.addUserActivity(
          context.activityDone,
          context.userId,
          { ...input, id: id.toString() }
        );
        return `Comment of id  ${input.id} updated successfully`;
      }
      throw new Error(`Comment of id ${id} not updated`);
    } catch (error) {
      throw new Error(`database error: : ${error}`);
    }
  }

  async canUserProceed (
    entityId: bigint,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string
  ): Promise<boolean> {
    console.log(role)
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
}
