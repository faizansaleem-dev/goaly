import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Export TypeOrmModule if you need CategoryRepository in other modules
})
export class CategoryModule {}
