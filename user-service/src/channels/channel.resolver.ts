import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { ChannelsService } from './channel.service';
import { ChannelResponseDto } from './dtos/channelResponse.dto';
import { CreateChannelInput } from './dtos/createChannelInput.dto';
import { DeleteChannelInput } from './dtos/deleteChannelInput.dto';
import { UpdateChannelInput } from './dtos/updateChannelInput.dto';

@Resolver()
export class ChannelsResolver {
  constructor (private readonly channelsService: ChannelsService) {}

  @Query(() => {
    return [ChannelResponseDto];
  })
  @UseGuards(AuthGuard)
  async getChannels (
    @Context() context: AuthGaurdContextDto
  ): Promise<ChannelResponseDto[]> {
    
    return this.channelsService.getChannel(context);
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createChannel (
    @Args('input') input: CreateChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'SUPERADMIN') {
      return this.channelsService.createChannel(input, context);
    }
    throw new UnauthorizedException(
      'you are not allowed only super admin can access'
    );
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async deleteChannel (
    @Args('input') input: DeleteChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'SUPERADMIN') {
      return this.channelsService.deleteChannel(input, context); // You can access `input.id` directly
    }
    throw new UnauthorizedException(
      'you are not allowed you are not a super admin'
    );
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async updateChannel (
    @Args('input') input: UpdateChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'SUPERADMIN') {
      return this.channelsService.updateChannel(input, context); // You can access `input.id` directly
    }
    throw new UnauthorizedException(
      'you are not allowed you are not a super admin'
    );
  }
}
