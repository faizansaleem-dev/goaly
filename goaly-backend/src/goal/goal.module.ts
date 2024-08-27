import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { User } from '../user/entities/user.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from 'src/income/entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, User, Expense, Income])],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
