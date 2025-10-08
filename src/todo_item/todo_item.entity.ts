import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TodoList } from '../todo_lists/todo_list.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  done: boolean;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @ManyToOne(() => TodoList, (todoList) => todoList.todoItems)
  @JoinColumn({ name: 'todoListId' })
  todoList?: TodoList;

  @Column()
  todoListId: number;
}
