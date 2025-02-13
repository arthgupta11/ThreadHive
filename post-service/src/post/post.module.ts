// import { BigIntScalar } from 'database-service/dist'; // Import BigIntScalar if using it here
import 'dotenv/config';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserActivityDao } from 'database-service-arth/dist';

import { AuthGuard } from '../gaurds/authGaurd.gaurds';
import { PostDao } from './post.dao';
import { PostsResolver } from './post.resolver';
import { PostsService } from './post.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '24h' },
    }),
    CacheModule.register(),
  ],
  providers: [PostsService, PostsResolver, PostDao, AuthGuard, UserActivityDao], // Register BigIntScalar here if needed
  exports: [PostsService],
})
export class PostsModule {}

