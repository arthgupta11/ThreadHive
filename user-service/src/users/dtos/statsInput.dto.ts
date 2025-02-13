import { Field, InputType } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';

@InputType()
export class StatsUserInput {
  @Field({ nullable: true })
  startDate?: Date ;

  @Field({ nullable: true })
  endDate?: Date ;

  @Field(
    () => {
      return BigIntScalar;
    },
    { nullable: true }
  ) // Assuming BigIntScalar is properly imported
  userId?: bigint;
}
