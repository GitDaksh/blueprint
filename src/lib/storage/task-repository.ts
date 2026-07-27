import { z } from "zod";
import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { taskSchema, type Task } from "@/lib/schema";

function getAllTasks(): Task[] {
  return readStorage<Task[]>(STORAGE_KEYS.tasks, []);
}

function saveAllTasks(tasks: Task[]): void {
  writeStorage(STORAGE_KEYS.tasks, tasks);
}

export const taskRepository = {
  async getByBoard(boardId: string): Promise<Task[]> {
    return getAllTasks()
      .filter((task) => task.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  },

  async create(
    input: Omit<z.input<typeof taskSchema>, "id" | "order" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const tasks = getAllTasks();
    const siblingCount = tasks.filter((t) => t.columnId === input.columnId).length;
    const now = new Date().toISOString();

    const newTask = taskSchema.parse({
      ...input,
      id: generateId(),
      order: siblingCount,
      createdAt: now,
      updatedAt: now,
    });

    saveAllTasks([...tasks, newTask]);
    return newTask;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = getAllTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task ${id} not found`);

    const updated = taskSchema.parse({
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    tasks[index] = updated;
    saveAllTasks(tasks);
    return updated;
  },

  async remove(id: string): Promise<void> {
    saveAllTasks(getAllTasks().filter((t) => t.id !== id));
  },

  async reorder(updates: { id: string; columnId: string; order: number }[]): Promise<void> {
    const tasks = getAllTasks();
    const updateMap = new Map(updates.map((u) => [u.id, u]));
    const now = new Date().toISOString();

    const next = tasks.map((task) => {
      const update = updateMap.get(task.id);
      if (!update) return task;
      return { ...task, columnId: update.columnId, order: update.order, updatedAt: now };
    });

    saveAllTasks(next);
  },
};