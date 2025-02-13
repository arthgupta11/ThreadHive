import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap () {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors({
    origin: ['https://studio.apollographql.com', 'http://localhost:5000'], // Add allowed origins
    credentials: true, // Allow cookies if using authentication
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(5000, '0.0.0.0');
  console.log(`Gateway is On-> running on: ${await app.getUrl()}`);
  // Set the application to listen on port 5000
}

bootstrap();
