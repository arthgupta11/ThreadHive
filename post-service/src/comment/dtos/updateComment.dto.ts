import { Field, InputType } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';
import {
  IsNotEmpty,
  IsString,
  MinLength,

} from 'class-validator';
@InputType()
export class UpdateCommentInput {
  @Field(() => BigIntScalar) // Assuming BigIntScalar is properly imported
  id!: bigint;

  @Field(() => BigIntScalar)
  modifiedBy!: bigint;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description!: string;

  @Field(() => BigIntScalar)
  channelId!: bigint;

  @Field(() => BigIntScalar)
  postId!: bigint;

  @Field({ nullable: true })
  modifiedAt?: Date;
}
