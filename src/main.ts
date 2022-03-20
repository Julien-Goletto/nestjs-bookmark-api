import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port: number = parseInt(process.env.PORT);
const host: string = process.env.HOST;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //tout ce qui n'est pas défini dans nos dto est retiré pour assainnir le body d'insert malveillants potentiels
    }),
  );
  await app.listen(port, () => {
    console.log(`Server is running at : http://${host}:${port}`);
  });
}
bootstrap();
