import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { ChannelDao } from './channel.dao';
import { ChannelResponseDto } from './dtos/channelResponse.dto';
import { CreateChannelInput } from './dtos/createChannelInput.dto';
import { DeleteChannelInput } from './dtos/deleteChannelInput.dto';
import { UpdateChannelInput } from './dtos/updateChannelInput.dto';

@Injectable()
export class ChannelsService {
  constructor (private readonly channelDao: ChannelDao) {} // Inject `ChannelDao`

  unauthorisedAccessMessage =
    'You are not allowed only super admin can access';
  async createChannel (input: CreateChannelInput, context: AuthGaurdContextDto) {
    if (context.role === 'SUPERADMIN') {
      return this.channelDao.createChannelDao(input, context);
    }
      throw new UnauthorizedException(this.unauthorisedAccessMessage);

  }

  async getChannel (
    context: AuthGaurdContextDto
  ): Promise<ChannelResponseDto[]> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.channelDao.getChannelsDao(context);
    }
      throw new UnauthorizedException(
        'You are not allowed only super admin or admin can access'
      );

  }

  async deleteChannel (
    input: DeleteChannelInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'SUPERADMIN') {
      return this.channelDao.deleteChannelDao(input, context);
    }
      throw new UnauthorizedException(this.unauthorisedAccessMessage);

  }

  async updateChannel (
    input: UpdateChannelInput,
    context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'SUPERADMIN') {
      return this.channelDao.updateChannel(input, context);
    }
      throw new UnauthorizedException(this.unauthorisedAccessMessage);

  }
}
