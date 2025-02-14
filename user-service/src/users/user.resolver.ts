import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserActivityResponseDto } from 'database-service-arth/dist/commonHelpers/activityResponse.dto';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { AuthGaurdContextDto } from '../gaurds/authGuardContext.dto';
import { CreateUserInput } from './dtos/createInput.dto';
import { DeleteUserInput } from './dtos/deleteInput.dto';
import { UserResponseDto } from './dtos/response.dto';
import { StatsUserInput } from './dtos/statsInput.dto';
import { StatsResponseDto } from './dtos/statsResponse.dto';
import { UpdateUserInput } from './dtos/updateInput.dto';
import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
  constructor (private readonly usersService: UsersService) {}

  @Query(() => {
    return [UserResponseDto];
  })
  @UseGuards(AuthGuard)
  async getUsers (
    @Context() context: AuthGaurdContextDto
  ): Promise<UserResponseDto[]> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.usersService.getUsers(context);
    }
    throw new UnauthorizedException(
      'You dont have access to this request with role of user}'
    );
  }

  @Query(() => {
    return [UserActivityResponseDto];
  })
  @UseGuards(AuthGuard)
  async getUserActivity (
    @Context() context: AuthGaurdContextDto
  ): Promise<UserActivityResponseDto[]> {
    if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
      return this.usersService.getUserActivity();
    }
    throw new UnauthorizedException(
      'You dont have access to this request with role of user}'
    );
  }

  @Query(() => {
    return [UserResponseDto];
  })
  @UseGuards(AuthGuard)
  async getUserByEmail (
    @Args('email') email: string,
    @Context() context: AuthGaurdContextDto
  ): Promise<UserResponseDto[]> {
    // console.log("resolver access",cont)
    if (email === context.email || context.role === 'SUPERADMIN') {
      return this.usersService.findUserByEmail(email, context);
    }
    throw new UnauthorizedException(
      `You dont have access to this request of email ${email}`
    );
  }

  @Query(() => {
    return [StatsResponseDto];
  })
  @UseGuards(AuthGuard)
  async getUserStats (
    @Args('input') input: StatsUserInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<StatsResponseDto[]> {
    return this.usersService.getUserStats(input, context);
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async createUser (
    @Args('input') input: CreateUserInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    if (input.role === 'SUPERADMIN') {
      throw new UnauthorizedException(
        `You dont have access to this request of creating user of role ${context.role}`
      );
    } else if (input.role === 'ADMIN' && context.role !== 'SUPERADMIN') {
      throw new UnauthorizedException(
        `You dont have access to this request of creating user of role ${context.role}`
      );
    } else {
      return this.usersService.createUser(input, context);
    }
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async deleteUser (
    @Args('input') input: DeleteUserInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    const { id } = input;
    if (
      (id === context.userId && context.role === 'USER') ||
      context.role === 'SUPERADMIN'
    ) {
      return this.usersService.deleteUser(input, context.role, context); // You can access `input.id` directly
    } else if (context.role === 'ADMIN') {
      return this.usersService.deleteUser(
        input,
        context.role,
        context,
        context.channels
      );
    }
    throw new UnauthorizedException(
      `You dont have rights to this to delete user of id ${id}`
    );
  }

  @Mutation(() => {
    return String;
  })
  @UseGuards(AuthGuard)
  async updateUser (
    @Args('input') input: UpdateUserInput,
    @Context() context: AuthGaurdContextDto
  ): Promise<string> {
    const { id } = input;
    if (id === context.userId || context.role === 'SUPERADMIN') {
      return this.usersService.updateUser(input, context); // You can access `input.id` directly
    }
    throw new UnauthorizedException(
      `You dont have rights to this to update user of id ${id}`
    );
  }
}
