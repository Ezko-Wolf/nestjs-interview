export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  deleted_at?: Date | null;
  todoListId?: number;
}
