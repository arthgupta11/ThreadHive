import { Injectable } from '@nestjs/common';
import { db, likes, UserActivityDao } from 'database-service-arth/dist';
import { and, eq } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { LikeEventInput } from './dtos/likeEventInput.dto';
import { LikeResponseDto } from './dtos/likeResponse.dto';

@Injectable()
export class LikesDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}
  async likeToggleDao (
    input: LikeEventInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    console.log('in create block');
    try {
      const inputObject = {
        type: input.type,
        typeId: input.typeId,
        likedBy: input.likedBy,
        postId: input.postId,
        count: 1,
        channelId: input.channelId,
        createdAt: new Date(),
      };
      const response = await db
        .select()
        .from(likes)
        .where(
          and(
            eq(likes.type, inputObject.type),
            eq(likes.typeId, inputObject.typeId),
            eq(likes.likedBy, inputObject.likedBy),
            eq(likes.postId, inputObject.postId),
            eq(likes.channelId, inputObject.channelId)
          )
        );
      if (response.length > 0) {
        const deleteStatus = await db
          .delete(likes)
          .where(
            and(
              eq(likes.type, inputObject.type),
              eq(likes.typeId, inputObject.typeId),
              eq(likes.likedBy, inputObject.likedBy),
              eq(likes.postId, inputObject.postId),
              eq(likes.channelId, inputObject.channelId)
            )
          );
        console.log(deleteStatus);
        await this.userActivityDao.addUserActivity('unliked', context.userId, {
          type: input.type,
          createdAt: new Date(),
          typeId: input.typeId.toString(),
          likedBy: input.likedBy.toString(),
          channelId: input.channelId.toString(),
          postId: input.postId.toString(),
        });
        return `${inputObject.type} of id -> ${inputObject.typeId} unliked`;
      }
        const likedStatus = await db.insert(likes).values(inputObject);

        await this.userActivityDao.addUserActivity('liked', context.userId, {
          type: input.type,
          createdAt: new Date(),
          typeId: input.typeId.toString(),
          likedBy: input.likedBy.toString(),
          channelId: input.channelId.toString(),
          postId: input.postId.toString(),
        });
        return `liked ${inputObject.type} , other details-> ${likedStatus}`;

    } catch (error) {
      throw new Error(`Database error -> ${error}`);
    }
  }

  async getLikesDao (): Promise<LikeResponseDto[]> {
    try {
      const response = (await db.select().from(likes)) as LikeResponseDto[];

      return response;
    } catch (error) {
      throw new Error(`Database error -> ${error}`);
    }
  }
}
