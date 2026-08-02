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

export const taskFormSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
});
export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const journalEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().max(20000).default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const snippetSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(200),
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required").max(20000),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Snippet = z.infer<typeof snippetSchema>;

export const snippetFormSchema = snippetSchema.pick({
  title: true,
  language: true,
  code: true,
});
export type SnippetFormValues = z.infer<typeof snippetFormSchema>;

export const focusSessionSchema = z.object({
  id: z.string(),
  label: z.string().max(200).optional(),
  durationSeconds: z.number(),
  completedAt: z.string(),
});
export type FocusSession = z.infer<typeof focusSessionSchema>;