// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Test');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  logger.log(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(3001);
}
bootstrap();
