import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      // Allow localhost and any 192.168.x.x IP
      if (origin && (origin === 'http://localhost' || /^http:\/\/192\.168\.\d+\.\d+/.test(origin))) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'), false); // Reject the request
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3001);
}
bootstrap();
