import { Module } from '@nestjs/common';
import { TodoItemController } from './todo_item.controller';
import { TodoItemService } from './todo_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem]), TodoListsModule],
  controllers: [TodoItemController],
  providers: [TodoItemService],
  exports: [TodoItemService],
})
export class TodoItemModule {}
