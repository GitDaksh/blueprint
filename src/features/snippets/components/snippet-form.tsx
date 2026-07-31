"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetFormSchema, type SnippetFormValues } from "@/lib/schema";
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
import { SNIPPET_LANGUAGES } from "@/lib/languages";

export interface SnippetSubmitValues extends SnippetFormValues {
  tags: string[];
}

interface SnippetFormProps {
  defaultValues?: SnippetFormValues;
  defaultTags?: string[];
  submitLabel?: string;
  onSubmit: (values: SnippetSubmitValues) => Promise<void>;
  onCancel: () => void;
}

export function SnippetForm({
  defaultValues,
  defaultTags = [],
  submitLabel = "Create Snippet",
  onSubmit,
  onCancel,
}: SnippetFormProps) {
  const [tagsInput, setTagsInput] = useState(defaultTags.join(", "));

  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: defaultValues ?? { title: "", language: "", code: "" },
  });

  async function handleSubmit(values: SnippetFormValues) {
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    await onSubmit({ ...values, tags });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="snippet-form-title">Title</FieldLabel>
              <Input
                {...field}
                id="snippet-form-title"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Debounced search hook"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="language"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="snippet-form-language">Language</FieldLabel>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="snippet-form-language" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {SNIPPET_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="snippet-form-tags">Tags</FieldLabel>
          <Input
            id="snippet-form-tags"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="react, hooks, performance"
          />
        </Field>

        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="snippet-form-code">Code</FieldLabel>
              <Textarea
                {...field}
                id="snippet-form-code"
                aria-invalid={fieldState.invalid}
                placeholder="Paste or write your snippet…"
                rows={10}
                className="font-mono text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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