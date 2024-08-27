import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { SeedService } from './seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../typeorm.config';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeorm],
    }),
    TypeOrmModule.forFeature([Category, User]), // Ensure this is present
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
