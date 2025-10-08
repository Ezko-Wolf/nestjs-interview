import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from '../todo_item.controller';
import { TodoItemService } from '../todo_item.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItem } from '../todo_item.entity';
import { mockTodoLists } from './mocked_data';
import { TodoListsService } from '../../todo_lists/todo_lists.service';

describe('TodoItemController', () => {
  let app: INestApplication;
  let todoItemController: TodoItemController;
  let todoItemRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;
  let todoListsServiceMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoItemRepositoryMock = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      create: jest.fn(),
    };

    todoListsServiceMock = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        TodoItemService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: todoItemRepositoryMock,
        },
        {
          provide: TodoListsService,
          useValue: todoListsServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    todoItemController = module.get<TodoItemController>(TodoItemController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('index', () => {
    it('should return all item for a given list', async () => {
      const list = mockTodoLists[0];
      const items = mockTodoLists[0].todoItems;
      todoItemRepositoryMock.find.mockResolvedValue(items);

      const result = await todoItemController.index(list.id);

      expect(result).toEqual(items);
      expect(todoItemRepositoryMock.find).toHaveBeenCalledWith({
        where: { todoListId: list.id },
      });
    });
  });

  describe('show', () => {
    it('should return a single item by id', async () => {
      const list = mockTodoLists[0];
      const item = mockTodoLists[0].todoItems![0];
      todoItemRepositoryMock.findOneBy.mockResolvedValue(item);
      const result = await todoItemController.show(list.id, item.id);
      expect(result).toEqual(item);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: item.id,
        todoListId: list.id,
      });
    });
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const list = mockTodoLists[0];
      const createDto = {
        title: 'New Item',
        description: 'Test description',
        todoListId: list.id,
      };
      const mockCreatedItem = {
        id: 10,
        ...createDto,
        done: false,
      };

      todoListsServiceMock.get.mockResolvedValue(list);
      todoItemRepositoryMock.create.mockReturnValue(mockCreatedItem);
      todoItemRepositoryMock.save.mockResolvedValue(mockCreatedItem);

      const result = await todoItemController.create(list.id, createDto);

      expect(result).toEqual(mockCreatedItem);
      expect(todoListsServiceMock.get).toHaveBeenCalledWith(list.id);
      expect(todoItemRepositoryMock.create).toHaveBeenCalledWith(createDto);
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith(mockCreatedItem);
    });
  });

  describe('update', () => {
    it('should update an existing todo item', async () => {
      const list = mockTodoLists[0];
      const existingItem = mockTodoLists[0].todoItems![0];
      const updateDto = { description: 'Updated description' };
      const updatedItem = { ...existingItem, ...updateDto };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(existingItem);
      todoItemRepositoryMock.save.mockResolvedValue(updatedItem);

      const result = await todoItemController.update(
        list.id,
        existingItem.id,
        updateDto,
      );

      expect(result).toEqual(updatedItem);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: existingItem.id,
        todoListId: list.id,
      });
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith(updatedItem);
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      const list = mockTodoLists[0];
      const item = mockTodoLists[0].todoItems![0];

      todoItemRepositoryMock.findOneBy.mockResolvedValue(item);
      todoItemRepositoryMock.softDelete.mockResolvedValue({ affected: 1 });

      await todoItemController.delete(list.id, item.id);

      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: item.id,
        todoListId: list.id,
      });
      expect(todoItemRepositoryMock.softDelete).toHaveBeenCalledWith(item.id);
    });
  });

  describe('completeTask', () => {
    it('should mark a todo item as complete', async () => {
      const list = mockTodoLists[0];
      const item = mockTodoLists[0].todoItems![0];
      const completedItem = { ...item, done: true };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(item);
      todoItemRepositoryMock.save.mockResolvedValue(completedItem);

      const result = await todoItemController.completeTask(list.id, item.id);

      expect(result).toEqual(completedItem);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: item.id,
        todoListId: list.id,
      });
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith(completedItem);
    });
  });
});
