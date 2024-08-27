import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { Goal } from './entities/goal.entity';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGoal(
    @Request() req,
    @Body()
    body: { target_amount: number; target_date: Date; current_amount?: number },
  ) {
    const userId = req.user.id;
    return this.goalService.createGoal(
      userId,
      body.target_amount,
      body.target_date,
      body.current_amount,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllGoals(@Request() req) {
    const userId = req.user.id;
    return this.goalService.findAllGoals(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateGoal(@Param('id') id: number, @Body() updateData: Partial<Goal>) {
    return this.goalService.updateGoal(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteGoal(@Param('id') id: number) {
    return this.goalService.deleteGoal(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('trend-data')
  async getTrendData(@Request() req) {
    const trendData = await this.goalService.getTrendData(req.user.id);
    return trendData;
  }
}
