import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreatePostInput } from './dtos/createPostInput.dto';
import { DeletePostInput } from './dtos/deletePostInput.dto';
import { PostResponseDto } from './dtos/postResponse.dto';
import { UpdatePostInput } from './dtos/updatePostInput.dto';
import { PostDao } from './post.dao';

@Injectable()
export class PostsService {
  constructor (private readonly postDao: PostDao,
   @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {} // Inject `UserDao`

  async createPost (input: CreatePostInput, context: AuthGaurdContextDto) {
    const dataObject = {
      title: input.title,
      description: input.description,
      createdBy: input.createdBy,
      modifiedBy: input.createdBy,
      channelId: input.channelId,
      createdAt: new Date(),
      isDeleted: false,
    };
    return this.postDao.createPostDao(dataObject, context);
  }

  async getPosts (context: AuthGaurdContextDto): Promise<PostResponseDto[]> {
    // return this.postDao.getPostsDao(context);
    const cacheKey = 'all_posts';

     // Check if posts are cached
     const cachedPosts = await this.cacheManager.get<PostResponseDto[]>(cacheKey);
     if (cachedPosts) {
       console.log('Returning cached posts...');
       return cachedPosts;
     }

     // Get posts from database
     const posts = await this.postDao.getPostsDao(context);

     // ✅ Convert `bigint` fields to `string` before caching
     const serializedPosts = posts.map((post) => {return {
       ...post,
       id: post.id.toString(), // Convert `bigint` fields to `string`
       createdBy: post.createdBy.toString(),
       modifiedBy: post.modifiedBy.toString(),
       channelId: post.channelId.toString(),
     };});

     await this.cacheManager.set(cacheKey, serializedPosts, 60 * 5); // 5 min cache

     return posts;
  }

  async deletePost (
    input: DeletePostInput,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string,
    context: AuthGaurdContextDto
  ): Promise<string> {
    if (
      await this.postDao.canUserProceed(input.id, channelsAllowed, userId, role)
    ) {
      return this.postDao.deletePostDao(input, context);
    }
    throw new UnauthorizedException('User not allowed to delete this post');
  }

  async updatePost (
    input: UpdatePostInput,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string,
    context: AuthGaurdContextDto
  ): Promise<string> {
    if (
      await this.postDao.canUserProceed(input.id, channelsAllowed, userId, role)
    ) {
      return this.postDao.updatePost(input, context);
    }
    throw new UnauthorizedException('User not allowed to modify this post');
  }
}
