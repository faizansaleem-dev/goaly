import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async addExpense(
    userId: number,
    amount: number,
    categoryId: number,
    date: Date,
    description?: string,
  ): Promise<Expense> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }

    const expense = this.expenseRepository.create({
      user,
      category,
      amount,
      date,
      description,
    });

    return this.expenseRepository.save(expense);
  }

  async getExpensesByUser(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: ['category'], // Ensure category is included in the response
      order: { date: 'DESC' },
    });
  }
}
