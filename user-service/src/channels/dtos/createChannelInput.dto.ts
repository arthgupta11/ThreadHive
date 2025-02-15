import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BigIntScalar } from 'database-service-arth/dist';

@InputType()
export class CreateChannelInput {

  @Field(() => {
      return BigIntScalar;
    }, {nullable : true}) // Assuming BigIntScalar is properly imported
    id?: bigint;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name!: string;
}
