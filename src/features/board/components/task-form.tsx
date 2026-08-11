"use client";

import { z } from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskFormValues } from "@/lib/schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface TaskSubmitValues extends TaskFormValues {
  tags: string[];
}

interface TaskFormProps {
  defaultValues?: TaskFormValues;
  defaultTags?: string[];
  submitLabel?: string;
  onSubmit: (values: TaskSubmitValues) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({
  defaultValues,
  defaultTags = [],
  submitLabel = "Create Task",
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [tagsInput, setTagsInput] = useState(defaultTags.join(", "));

  const form = useForm<z.input<typeof taskFormSchema>, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultValues ?? { title: "", description: "", priority: "medium" },
  });

  async function handleSubmit(values: TaskFormValues) {
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    await onSubmit({ ...values, tags });
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-title">Title</FieldLabel>
              <Input
                {...field}
                id="task-form-title"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Fix navbar overflow bug"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-form-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="task-form-description"
                aria-invalid={fieldState.invalid}
                placeholder="Optional details…"
                rows={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-form-priority">Priority</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-form-priority" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-form-due-date">Due Date</FieldLabel>
                <Input
                  type="date"
                  id="task-form-due-date"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || undefined)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Field>
          <FieldLabel htmlFor="task-form-tags">Tags</FieldLabel>
          <Input
            id="task-form-tags"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="frontend, bug, urgent"
          />
        </Field>

        <Field orientation="horizontal" className="justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}