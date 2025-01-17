import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, UserRepository],
  imports: [DatabaseModule],
  controllers: [UserController],
})
export class UserModule {}
