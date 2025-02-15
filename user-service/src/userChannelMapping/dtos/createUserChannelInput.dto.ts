import { Field, InputType } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';

@InputType()
export class CreateUserChannelInput {
  //added extra id field 
  @Field(()=>{
    return BigIntScalar;
  },{nullable: true})
  id?: bigint;

  @Field(() => {
    return BigIntScalar;
  })
  userId!: bigint;

  @Field(() => {
    return BigIntScalar;
  })
  channelId!: bigint;
}
