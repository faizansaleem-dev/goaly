import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCategory(name: string, userId?: number): Promise<Category> {
    let user: User | null = null;

    if (userId) {
      user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const category = this.categoryRepository.create({ name, user });
    return this.categoryRepository.save(category);
  }

  async getCategories(userId?: number): Promise<Category[]> {
    if (userId) {
      return this.categoryRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { name: 'ASC' },
      });
    }
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
