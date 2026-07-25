import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof prioritySchema>;

export const taskSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  columnId: z.string(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  priority: prioritySchema.default("medium"),
  tags: z.array(z.string()).default([]),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const columnSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  title: z.string().min(1, "Column name is required").max(50),
  order: z.number(),
});
export type Column = z.infer<typeof columnSchema>;

export const boardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Board name is required").max(100),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Board = z.infer<typeof boardSchema>;