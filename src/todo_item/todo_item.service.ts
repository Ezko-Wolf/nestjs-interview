import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from './todo_item.entity';
import { CreateTodoItemDto } from './dtos/create_todo_item';
import { UpdateTodoItemDto } from './dtos/update_todo_item';
import { TodoListsService } from '../todo_lists/todo_lists.service';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
    private readonly todoListsService: TodoListsService,
  ) {}

  async all(listId: number): Promise<TodoItem[]> {
    return await this.todoItemRepository.find({
      where: { todoListId: listId },
    });
  }

  async get(id: number, todoListId?: number): Promise<TodoItem | null> {
    return await this.todoItemRepository.findOneBy({ id, todoListId });
  }

  async create(dto: CreateTodoItemDto): Promise<TodoItem> {
    const list = await this.todoListsService.get(dto.todoListId);
    if (!list) {
      throw new Error('TodoList not found');
    }

    const TodoItem = this.todoItemRepository.create(dto);
    return await this.todoItemRepository.save(TodoItem);
  }

  async update(
    id: number,
    dto: UpdateTodoItemDto,
    todoListId?: number,
  ): Promise<TodoItem> {
    const item = await this.get(id, todoListId);
    if (!item) {
      throw new Error('Item not found');
    }
    return await this.todoItemRepository.save({ ...item, ...dto });
  }

  async delete(id: number, todoListId?: number): Promise<void> {
    const item = await this.get(id, todoListId);
    if (!item) {
      throw new Error('Item not found');
    }
    await this.todoItemRepository.softDelete(id);
  }

  async completeTask(id: number, todoListId?: number): Promise<TodoItem> {
    const item = await this.get(id, todoListId);
    if (!item) {
      /* Hay que agregar un manejo de errores!
       ** Agregar algo generico como un middleware o
       ** el metodo que nest disponga para esto
       ** y definir las clases necesarias
       */
      throw new Error('Item not found');
    }
    item.done = true;
    return await this.todoItemRepository.save(item);
  }
}
