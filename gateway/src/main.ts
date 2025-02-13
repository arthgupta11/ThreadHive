import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'dotenv/config';
import fastifyRateLimit from '@fastify/rate-limit';
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

  await app.register(fastifyRateLimit, {
    max: 100, // Maximum requests per time window
    timeWindow: '1 minute', // Time window for the rate limit
    cache: 5000, // Number of IPs to keep in memory (default: 5000)
    // allowList: ['127.0.0.1'], // Whitelist specific IPs
    ban: 100, // Ban users after 5 failed requests
    keyGenerator: (req) => req.ip, // Use IP address as the key for rate limiting
    errorResponseBuilder: (req, context) => {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${context.after}ms`,
      };
    },
  });

  await app.listen(5000, '0.0.0.0');
  console.log(`Gateway is On-> running on: ${await app.getUrl()}`);
  // Set the application to listen on port 5000
}

bootstrap();
