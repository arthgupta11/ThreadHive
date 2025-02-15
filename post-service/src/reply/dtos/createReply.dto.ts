import { Field, InputType } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';
import {
  IsNotEmpty,
  IsString,
  MinLength,

} from 'class-validator';

@InputType()
export class CreateReplyInput {

  @Field(() => BigIntScalar,{nullable: true})
  id?: bigint;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description!: string;

  @Field(() => BigIntScalar)
  createdBy!: bigint;

  @Field(() => BigIntScalar)
  channelId!: bigint;

  @Field(() => BigIntScalar)
  commentId!: bigint;

  @Field(() => BigIntScalar)
  postId!: bigint;
}
