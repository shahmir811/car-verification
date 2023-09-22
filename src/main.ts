import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['MY_SECRET'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this means if we pass extra parameters in the request, it just wipe out those extra parameters
    }),
  );
  await app.listen(3000);
}
bootstrap();
