import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() body, @Request() req) {
    const userId = req.user ? req.user.id : undefined;
    return this.categoryService.createCategory(body.name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCategories(@Request() req) {
    const userId = req.user ? req.user.id : undefined;
    return this.categoryService.getCategories(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
