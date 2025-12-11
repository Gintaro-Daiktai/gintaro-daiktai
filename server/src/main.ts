import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeederService } from './database/seeder.service';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: '3mb' }));
  app.use(urlencoded({ extended: true, limit: '3mb' }));

  const configService = app.get(ConfigService);

  const seeder = app.get(SeederService);
  await seeder.seedAdminUser();

  const port: number | undefined = configService.get<number>('PORT');
  const frontend_url: string | undefined =
    configService.get<string>('FRONTEND_URL');

  if (port === undefined) {
    console.warn('PORT undefined in .env.');
  }
  if (frontend_url === undefined) {
    console.warn('FRONTEND_URL undefined in .env.');
  }

  app.enableCors({
    origin: frontend_url ?? 'http://localhost:5173',
  });

  await app.listen(port ?? 3000);
}
void bootstrap();
