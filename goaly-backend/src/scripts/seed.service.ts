import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedCategories() {
    // Fetch an existing user (you can modify this to create a new user or fetch based on your logic)
    const user = await this.userRepository.findOne({
      where: { username: 'faizan5' },
    });

    if (!user) {
      throw new Error('User not found. Please create a user first.');
    }

    const categories = [
      { name: 'Groceries', user },
      { name: 'Transportation', user },
      { name: 'Utilities', user },
      { name: 'Entertainment', user },
      { name: 'Healthcare', user },
      { name: 'Dining Out', user },
      { name: 'Travel', user },
      { name: 'Education', user },
      { name: 'Shopping', user },
      { name: 'Insurance', user },
    ];

    for (const categoryData of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name, user },
      });
      if (!existingCategory) {
        const category = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(category);
      }
    }

    console.log('Categories seeded successfully!');
  }
}
