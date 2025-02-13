import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserChannelInput } from './dtos/createUserChannelInput.dto';
import { DeleteUserChannelInput } from './dtos/deleteUserChannelInput.dto';
import { UserChannelResponseDto } from './dtos/responseUserChannel.dto';
import { UpdateUserChannelInput } from './dtos/updateUserChannelInput.dto';
import { UserChannelService } from './userChannel.service';

@Resolver()
export class UserChannelResolver {
  constructor (private readonly userChannelService: UserChannelService) {}

  unAuthorizedMessage = 'You dont have access to this request with role of user';
  @Query(() => {
    return [UserChannelResponseDto];
  })
  @UseGuards(AuthGuard)
  async getUserChannelMapping (
    @Context() context: AuthGaurdContextDto
  ): Promise<UserChannelResponseDto[]> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.userChannelService.getUserChannelMapping(context);
    }
      throw new UnauthorizedException(
        this.unAuthorizedMessage
      );

  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createUserChannelMapping (
    @Args('input') input: CreateUserChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.userChannelService.createUserChannelMapping(input, context);
    }
      throw new UnauthorizedException(
        this.unAuthorizedMessage
      );

  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async deleteUserChannelMapping (
    @Args('input') input: DeleteUserChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.userChannelService.deleteUserChannelMapping(input, context); // You can access `input.id` directly
    }
      throw new UnauthorizedException(
        this.unAuthorizedMessage
      );

  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async updateUserChannelMapping (
    @Args('input') input: UpdateUserChannelInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.userChannelService.updateUserChannelMapping(input, context); // You can access `input.id` directly
    }
      throw new UnauthorizedException(
        this.unAuthorizedMessage
      );

  }
}
