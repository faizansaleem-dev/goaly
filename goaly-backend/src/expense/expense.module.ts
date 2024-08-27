import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { CategoryModule } from '../category/category.module'; // Import the CategoryModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, User, Category]), // Include Category in TypeOrmModule
    CategoryModule, // Import the CategoryModule here
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
