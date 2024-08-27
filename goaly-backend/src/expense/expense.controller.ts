import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addExpense(@Request() req, @Body() body) {
    const userId = req.user.id;
    const { amount, categoryId, date, description } = body;
    return this.expenseService.addExpense(
      userId,
      amount,
      categoryId,
      new Date(date),
      description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getExpenses(@Request() req) {
    const userId = req.user.id;
    return this.expenseService.getExpensesByUser(userId);
  }
}
