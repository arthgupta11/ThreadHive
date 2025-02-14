import { Injectable } from '@nestjs/common';
import {
  comments,
  db,
  likes,
  posts,
  replies,
  UserActivityDao,
  users,
} from 'database-service-arth/dist';
import { and, asc, count, desc, eq, gte, lte, SQL } from 'drizzle-orm';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { StatsUserInput } from './dtos/statsInput.dto';
import { StatsResponseDto } from './dtos/statsResponse.dto';

@Injectable()
export class userStatsDao {
  constructor (private readonly userActivityDao: UserActivityDao) {}

  async getUserPostStats (input: StatsUserInput, context: AuthGaurdContextDto) {
    const { startDate, endDate, userId } = input;

    const conditions: SQL[] = [];

    if (startDate) {conditions.push(gte(posts.createdAt, startDate));}
    if (endDate) {conditions.push(lte(posts.createdAt, endDate));}

    // Get all userIds if no specific user is provided
    const userIds = userId
      ? [userId]
      : await db
          .select({ id: users.id })
          .from(users)
          .then((response) => {return response.map((u) => {return u.id;});});
    console.log("userids", userIds)
    const result = await Promise.all(
      userIds.map(async (uid) => {
        // Fetch posts with max & min likes
        const [postWithMaxLikes] = await db
          .select({ post: posts })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .where(and(...conditions, eq(posts.createdBy, uid)))
          .groupBy(posts.id)
          .orderBy(desc(count(likes.id)))
          .limit(1) || [{}];

        const [postWithMinLikes] = await db
          .select({ post: posts })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .where(and(...conditions, eq(posts.createdBy, uid)))
          .groupBy(posts.id)
          .orderBy(asc(count(likes.id)))
          .limit(1) || [{}];

        // Get total comments (without filtering by posts.createdAt)
        const totalComments = await db.$count(comments, and(eq(comments.createdBy, uid)));

        const totalReplies = await db.$count(replies, and(eq(replies.createdBy, uid)));

        // Get total likes (without filtering by posts.createdAt)
        const totalLikesOnPosts = await db.$count(likes,and(eq(likes.likedBy, uid), eq(likes.type, 'POST')));

        const totalLikesOnComments = await db.$count(likes, and(eq(likes.likedBy, uid), eq(likes.type, 'COMMENT')));

        const totalLikesOnReplies = await db.$count(likes,and(eq(likes.likedBy, uid), eq(likes.type, 'REPLY')));

       

        return {
          id: uid,
          postWithMaxLikes: postWithMaxLikes?.post ?? null,
          postWithMinLikes: postWithMinLikes?.post ?? null,
          totalComments,
          totalReplies,
          totalLikesOnPosts,
          totalLikesOnComments,
          totalLikesOnReplies,
        };
      })
    );
    this.userActivityDao.addUserActivity(
      context.activityDone,
      context.userId,
      { request: 'success' }
    );
    return result as StatsResponseDto[];
  }
}
