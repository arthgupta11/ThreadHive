import { Field, InputType } from '@nestjs/graphql';

import { BigIntScalar, USERROLE } from 'database-service-arth/dist';


@InputType()
export class UpdateUserInput {
  @Field(() => {
    return BigIntScalar;
  }) // Assuming BigIntScalar is properly imported
  id!: bigint;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  role?: USERROLE; // The role is optional here

  @Field({ nullable: true })
  dob?: Date;

  @Field({ nullable: true })
  modifiedAt?: Date;
}
