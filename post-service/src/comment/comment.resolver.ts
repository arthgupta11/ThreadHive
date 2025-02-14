import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CommentsService } from './comment.service';
import { CommentResponseDto } from './dtos/commentResponse.dto';
import { CreateCommentInput } from './dtos/createCommentInput.dto';
import { DeleteCommentInput } from './dtos/deleteCommentInput.dto';
import { UpdateCommentInput } from './dtos/updateComment.dto';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => {
    return [CommentResponseDto];
  })
  @UseGuards(AuthGuard)
  async getComments(
    @Context() context: AuthGaurdContextDto
  ): Promise<CommentResponseDto[]> {
    return this.commentsService.getComments(context);
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createComment(
    @Args('input') input: CreateCommentInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (
      context.role === 'SUPERADMIN' ||
      (context.channelsAllowed.includes(input.channelId) &&
        context.userId.toString() === input.createdBy.toString())
    ) {
      return this.commentsService.createComment(input, context);
    }
    throw new UnauthorizedException(
      `you dont have access to this channel -> ${input.channelId}`
    );
  }

  @Mutation(() => {
    return String;
  })
  async deleteComment(
    @Args('input') input: DeleteCommentInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    return this.commentsService.deleteComment(
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
  async updateComment(
    @Args('input') input: UpdateCommentInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {

    return this.commentsService.updateComment(
      input,
      context.channelsAllowed,
      context.userId,
      context.role,
      context
    ); // You can access `input.id` directly
  }
}
