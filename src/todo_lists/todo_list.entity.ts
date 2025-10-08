import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { TodoItem } from '../todo_item/todo_item.entity';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todoList, {
    cascade: ['soft-remove'],
  })
  todoItems?: TodoItem[];
}
