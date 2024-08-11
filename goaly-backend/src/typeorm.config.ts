import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity'; // import your entities
import { Expense } from './expense/entities/expense.entity';
import { Goal } from './goal/entities/goal.entity';
import { Income } from './income/entities/income.entity';
import { Category } from './category/entities/category.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `localhost`,
  port: `5432`,
  username: `postgres`,
  password: `postgres`,
  database: `goaly`,
  //   entities: [User, Expense, Goal, Income, Category],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

connectionSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
