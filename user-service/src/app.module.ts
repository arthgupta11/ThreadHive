import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channel.module';
import { UserChannelMappingModule } from './userChannelMapping/userChannel.module';
import { UsersModule } from './users/user.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
      
    }),
    ChannelsModule,
    UserChannelMappingModule,
    UsersModule,
    AuthModule,
  ], // Export the db object so it can be used in other modules
  providers: [BigIntScalar],
})
export class AppModule {}
