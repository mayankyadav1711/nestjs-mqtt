import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mqttBroker } from './mqtt-broker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mqttBroker.connect();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();