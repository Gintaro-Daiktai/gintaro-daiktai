import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port: number | undefined = configService.get<number>('PORT')
  const frontend_url: string | undefined = configService.get<string>('FRONTEND_URL')
  
  if (port === undefined) {
    console.warn("PORT undefined in .env.")
  }
  if (frontend_url === undefined) {
    console.warn("FRONTEND_URL undefined in .env.")
  }

  app.enableCors({
    origin: frontend_url ?? 'http://localhost:5173',
  });


  await app.listen(port ?? 3000);
}
bootstrap();
