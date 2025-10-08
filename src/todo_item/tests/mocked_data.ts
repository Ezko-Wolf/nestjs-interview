import { TodoList } from 'src/todo_lists/todo_list.entity';
import { TodoItem } from '../todo_item.entity';

export const item1_list1: TodoItem = {
  id: 1,
  title: 'Item 1',
  description: 'Description 1',
  done: false,
  todoListId: 1,
  deleted_at: null,
};

export const item2_list1: TodoItem = {
  id: 2,
  title: 'Item 2',
  description: 'item completed',
  done: true,
  todoListId: 1,
  deleted_at: null,
};

export const mockTodoLists: TodoList[] = [
  {
    id: 1,
    name: 'Shopping List',
    todoItems: [item1_list1, item2_list1],
    deleted_at: null,
  },
  { id: 2, name: 'Work Tasks', todoItems: [], deleted_at: null },
];
