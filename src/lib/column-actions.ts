import { taskRepository } from "./storage/task-repository";
import { columnRepository } from "./storage/column-repository";

export async function deleteColumnAndTasks(boardId: string, columnId: string): Promise<void> {
  const tasks = await taskRepository.getByBoard(boardId);
  const tasksInColumn = tasks.filter((t) => t.columnId === columnId);
  await Promise.all(tasksInColumn.map((task) => taskRepository.remove(task.id)));
  await columnRepository.remove(columnId);
}