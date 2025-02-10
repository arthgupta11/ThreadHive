import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,

      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://127.0.0.1:3000/graphql' }, // Replace with your user service URL
            { name: 'posts', url: 'http://127.0.0.1:4000/graphql' }, // Replace with your post service URL
          ],
        }),
        buildService: ({ url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              // Forward the Authorization header to the subgraphs
              if (context.req && context.req.headers) {
                request.http?.headers.set('Authorization', context.req.headers.authorization);
              }
            },
          });
        },
      },
      // // Enable subscriptions if necessary
      // subscriptions: false,
    }),
  ],
})
export class AppModule {}
