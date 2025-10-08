import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create_todo_item';
import { TodoItemService } from './todo_item.service';
import { TodoItem } from '../interfaces/todo_item.interface';
import { UpdateTodoItemDto } from './dtos/update_todo_item';

@Controller('api/todolists/:todoListId/items')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Get()
  index(@Param('todoListId') todoListId: number): Promise<TodoItem[]> {
    return this.todoItemService.all(todoListId);
  }

  @Get('/:itemId')
  show(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
  ): Promise<TodoItem | null> {
    return this.todoItemService.get(itemId, todoListId);
  }

  @Post()
  create(
    @Param('todoListId') todoListId: number,
    @Body() dto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemService.create({ ...dto, todoListId });
  }

  @Put('/:itemId')
  update(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemService.update(itemId, dto, todoListId);
  }

  @Delete('/:itemId')
  delete(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
  ): Promise<void> {
    return this.todoItemService.delete(itemId, todoListId);
  }

  @Patch('/:itemId/complete')
  completeTask(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
  ): Promise<TodoItem> {
    return this.todoItemService.completeTask(itemId, todoListId);
  }
}
