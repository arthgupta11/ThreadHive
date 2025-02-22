import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BigIntScalar } from 'database-service-arth/dist';
import { CommentsModule } from './comment/comment.module';
import { LikesModule } from './like/like.module';
import { PostsModule } from './post/post.module';
import { RepliesModule } from './reply/reply.module';
// import { db } from 'database-service/dist'; // Adjust the import path

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    LikesModule,
    PostsModule,
    CommentsModule,
    RepliesModule,
  ], // Export the db object so it can be used in other modules
  providers: [BigIntScalar],
})
export class AppModule {}
