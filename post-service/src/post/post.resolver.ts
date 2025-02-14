import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreatePostInput } from './dtos/createPostInput.dto';
import { DeletePostInput } from './dtos/deletePostInput.dto';
import { PostResponseDto } from './dtos/postResponse.dto';
import { UpdatePostInput } from './dtos/updatePostInput.dto';
import { PostsService } from './post.service';

@Resolver()
export class PostsResolver {
  constructor (private readonly postsService: PostsService) {}

  @Query(() => {
    return [PostResponseDto];
  })
  @UseGuards(AuthGuard)
  async getPosts (
    @Context() context: AuthGaurdContextDto
  ): Promise<PostResponseDto[]> {
    return this.postsService.getPosts(context);
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createpost (
    @Args('input') input: CreatePostInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {

    if (
      (context.role === 'SUPERADMIN') ||
      (context.channelsAllowed.includes(input.channelId) &&
      context.userId.toString() === input.createdBy.toString() )
    ) {
      return this.postsService.createPost(input, context);
    }
    throw new UnauthorizedException(
      `you dont have access to this channel -> ${input.channelId}`
    );
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async deletepost (
    @Args('input') input: DeletePostInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    return this.postsService.deletePost(
      input,
      context.channelsAllowed,
      context.userId,
      context.role,
      context
    ); // You can access `input.id` directly
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async updatepost (
    @Args('input') input: UpdatePostInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    return this.postsService.updatePost(
      input,
      context.channelsAllowed,
      context.userId,
      context.role,
      context
    ); // You can access `input.id` directly
  }
}
