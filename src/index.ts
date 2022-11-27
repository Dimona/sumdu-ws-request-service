import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';

let server: Handler;

const bootstrap = async (): Promise<Handler> => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, whitelist: true }));
  app.enableCors();
  await app.init();

  return serverlessExpress({ app: app.getHttpAdapter().getInstance() });
};

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
