import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { User } from '../user/entities/user.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from 'src/income/entities/income.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async createGoal(
    userId: number,
    targetAmount: number,
    targetDate: Date,
    currentAmount?: number,
  ): Promise<Goal> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const goal = this.goalRepository.create({
      user,
      target_amount: targetAmount,
      current_amount: currentAmount || 0,
      target_date: targetDate,
    });

    return this.goalRepository.save(goal);
  }

  async findAllGoals(userId: number): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { user: { id: userId } },
      order: { target_date: 'ASC' },
    });
  }

  async updateGoal(id: number, updateData: Partial<Goal>): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    Object.assign(goal, updateData);
    return this.goalRepository.save(goal);
  }

  async deleteGoal(id: number): Promise<void> {
    const result = await this.goalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Goal not found');
    }
  }

  async getTrendData(userId: number) {
    // Fetch all expenses for the user
    const expenses = await this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
    });

    // Fetch the current goal for the user (assuming there is only one active goal)
    const goal = await this.goalRepository.findOne({
      where: { user: { id: userId } },
    });

    // Fetch all incomes for the user
    const incomes = await this.incomeRepository.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
    });

    if (!goal) {
      throw new Error('No active savings goal found for the user');
    }

    const monthlyData = this.calculateMonthlyData(expenses, incomes, goal);
    return { monthlyData };
  }

  private calculateMonthlyData(
    expenses: Expense[],
    incomes: Income[],
    goal: Goal,
  ) {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );
    const totalIncome = incomes.reduce(
      (sum, income) => sum + Number(income.amount),
      0,
    );

    const currentDate = new Date();
    const targetDate = new Date(goal.target_date);

    // Calculate remaining months
    const remainingMonths = this.getMonthDifference(currentDate, targetDate);

    const averageMonthlySpending = totalExpenses / remainingMonths;
    const averageMonthlyIncome = totalIncome / remainingMonths;
    const requiredMonthlySaving =
      (Number(goal.target_amount) - Number(goal.current_amount)) /
      remainingMonths;

    // Generate monthly projections
    const projections = [];
    let accumulatedSavings = Number(goal.current_amount);

    for (let i = 0; i < remainingMonths; i++) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      accumulatedSavings +=
        requiredMonthlySaving + (averageMonthlyIncome - averageMonthlySpending);

      projections.push({
        month: this.formatMonth(monthDate),
        requiredMonthlySaving: requiredMonthlySaving,
        averageMonthlySpending: averageMonthlySpending,
        averageMonthlyIncome: averageMonthlyIncome,
        accumulatedSavings: accumulatedSavings,
      });
    }

    return projections;
  }

  private getMonthDifference(startDate: Date, endDate: Date): number {
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1
    );
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
