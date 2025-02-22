import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'http://localhost:4000',
      'http://localhost:5000',
    ], // Add allowed origins
    credentials: true, // Allow cookies if using authentication
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  try {
    await app.listen(3000, '0.0.0.0');
    console.log(`Users service is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.info('error', error);
  }
}

bootstrap();
