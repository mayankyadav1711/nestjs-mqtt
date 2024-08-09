import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserDetailsController } from './user-details/user-details.controller';

@Module({
  imports: [],
  controllers: [AppController, UserDetailsController],
  providers: [AppService],
})
export class AppModule {}