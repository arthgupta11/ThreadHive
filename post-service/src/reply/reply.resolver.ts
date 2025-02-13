import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateReplyInput } from './dtos/createReply.dto';
import { DeleteReplyInput } from './dtos/deleteReply.dto';
import { ReplyResponseDto } from './dtos/replyComment.dto';
import { UpdateReplyInput } from './dtos/updateReply.dto';
import { RepliesService } from './reply.service';

@Resolver()
export class RepliesResolver {
  constructor (private readonly repliesService: RepliesService) {}

  @Query(() => {
    return [ReplyResponseDto];
  })
  @UseGuards(AuthGuard)
  async getReplies (
    @Context() context: AuthGaurdContextDto
  ): Promise<ReplyResponseDto[]> {
   
    return this.repliesService.getReplies(context);
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createReply (
    @Args('input') input: CreateReplyInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (
      context.channelsAllowed.includes(input.channelId) &&
      context.userId.toString() === input.createdBy.toString()
    ) {
      return this.repliesService.createReply(input, context);
    }
    throw new UnauthorizedException(
      `you dont have access to this channel -> ${input.channelId}`
    );
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async deleteReply (
    @Args('input') input: DeleteReplyInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    return this.repliesService.deleteReply(
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
  async updateReply (
    @Args('input') input: UpdateReplyInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    return this.repliesService.updateReply(
      input,
      context.channelsAllowed,
      context.userId,
      context.role,
      context
    ); // You can access `input.id` directly
  }
}
