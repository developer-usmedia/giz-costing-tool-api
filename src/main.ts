import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { environment } from '@common/environment/environment';
import { AppModule } from './app.module';

const setupSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('GIZ Costing Tool API')
    .setDescription('API for the GIZ Living Wage Costing Too')
    .addTag('giz-costing-tool-api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:4200',
    ],
    credentials: true,
  });

  setupSwagger(app);

  if(!environment.isValid()) {
    throw new Error('Missing environment variables, see environment.ts');
  }

  await app.listen(3000);
}
bootstrap();
