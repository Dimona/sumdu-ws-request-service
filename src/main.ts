import { DEFAULT_PORT } from '@app/constants/app.constants';
import { AppModule } from '@app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, whitelist: true }));
  app.enableCors();

  const port = app.get(ConfigService).get<number>('PORT') || DEFAULT_PORT;

  await app.listen(port, () => {
    Logger.log(`Server is listening on ${port} port`, 'NestApplication');
  });
}

bootstrap();
