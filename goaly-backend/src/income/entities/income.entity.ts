import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.incomes)
  user: User;

  @Column('decimal')
  amount: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
