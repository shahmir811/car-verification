import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this means if we pass extra parameters in the request, it just wipe out those extra parameters
    }),
  );
  await app.listen(3000);
}
bootstrap();
