import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateReplyInput } from './dtos/createReply.dto';
import { DeleteReplyInput } from './dtos/deleteReply.dto';
import { ReplyResponseDto } from './dtos/replyComment.dto';
import { UpdateReplyInput } from './dtos/updateReply.dto';
import { ReplyDao } from './reply.dao';

@Injectable()
export class RepliesService {
  constructor (private readonly replyDao: ReplyDao) {} // Inject `UserDao`

  async createReply (input: CreateReplyInput, context: AuthGaurdContextDto) {
    const dataObject = {
      description: input.description,
      createdBy: input.createdBy,
      modifiedBy: input.createdBy,
      commentId: input.commentId,
      postId: input.postId,
      channelId: input.channelId,
      createdAt: new Date(),
      isDeleted: false,
    };
    return this.replyDao.createReplyDao(dataObject, context);
  }

  async getReplies (context: AuthGaurdContextDto): Promise<ReplyResponseDto[]> {
    return this.replyDao.getRepliesDao(context);
  }

  async deleteReply (
    input: DeleteReplyInput,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string,
    context: AuthGaurdContextDto
  ): Promise<string> {
    if (
      await this.replyDao.canUserProceed(
        input.id,
        channelsAllowed,
        userId,
        role
      )
    ) {
      return this.replyDao.deleteReplyDao(input, context);
    }
    throw new UnauthorizedException('User not allowed to delete this post');
  }

  async updateReply (
    input: UpdateReplyInput,
    channelsAllowed: bigint[],
    userId: bigint,
    role: string,
    context: AuthGaurdContextDto
  ): Promise<string> {
    
    if (
      await this.replyDao.canUserProceed(
        input.id,
        channelsAllowed,
        userId,
        role
      )
    ) {
      return this.replyDao.updateReply(input, context);
    }
    throw new UnauthorizedException('User not allowed to update this post');
  }
}
