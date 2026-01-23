import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "../ui/skeleton";

// Field Configuration Type
export type FieldConfig = {
  id: number;
  field: string;
  label: string;
  type: string;
  interface: "TEXT" | "NUMERIC" | "RADIO" | "FILE" | string;
  is_required: boolean | number;
  regex?: string | null;
  options?: string | null;
  hidden?: boolean | number;
  sort?: number;
  extensions?: string | null;
  max_file_size?: string | null;
  multipart?: boolean | number;
  created_at?: string;
  updated_at?: string;
  feature_id?: number;
  upload_type?: string | null;
};

function parseOptions(options?: string | null) {
  if (!options) return [];
  try {
    return JSON.parse(options) as { label: string; value: string }[];
  } catch {
    return [];
  }
}

function buildZodSchema(fields: FieldConfig[]) {
  const shape: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.hidden) return;

    let schema: any = z.any();

    switch (field.interface) {
      case "TEXT":
        schema = z.string();
        if (field.regex) {
          schema = schema.regex(new RegExp(field.regex), "Invalid format");
        }
        break;

      case "NUMERIC":
        schema = z.string().regex(new RegExp(field.regex || "^[0-9]+$"), "Invalid number");
        break;

      case "RADIO":
        schema = z.string();
        break;

      case "FILE":
        schema = z.any().refine((file) => file instanceof File, "File is required");
        break;
    }

    if (field.is_required) {
      schema = schema.refine((v: any) => v !== undefined && v !== "", {
        message: `${field.label} is required`,
      });
    }

    shape[field.field] = schema;
  });

  return z.object(shape);
}

// Form Builder Component

export function DynamicFormBuilder({
  fields,
  onSubmit,
  btnVariants,
  btnClassName,
  btnLabel,
  isLoading = false,
}: {
  fields: FieldConfig[];
  onSubmit: (values: any) => void;
  btnVariants?: any;
  btnClassName?: string;
  btnLabel?: string;
  isLoading: boolean;
}) {
  const schema = React.useMemo(() => buildZodSchema(fields), [fields]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields
          .filter((f) => !f.hidden)
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.field}
              render={({ field: rhf }) => (
                <FormItem>
                  <FormLabel>
                    {field.label}
                    {field.is_required ? <span className="ml-1 text-red-500">*</span> : null}
                  </FormLabel>

                  <FormControl>{renderField(field, rhf)}</FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        <div className={btnClassName}>
          {form.formState.isSubmitting || isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Button type="submit" variant={btnVariants}>
              {btnLabel || "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

// Renders individual form fields based on their configuration

function renderField(field: FieldConfig, rhf: any) {
  switch (field.interface) {
    case "TEXT":
      return <Input {...rhf} {...field} type="text" placeholder={field.label} />;

    case "NUMERIC":
      return <Input {...rhf} {...field} type="text" inputMode="numeric" placeholder={field.label} onChange={(e) => rhf.onChange(e.target.value.replace(/\D/g, ""))} />;

    case "RADIO":
      return (
        <RadioGroup value={rhf.value} onValueChange={rhf.onChange} className="flex gap-4">
          {parseOptions(field.options).map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${field.field}-${opt.value}`} />
              <Label htmlFor={`${field.field}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "FILE":
      return (
        <Input
          type="file"
          accept={field.extensions
            ?.split(",")
            .map((e) => `.${e.toLowerCase()}`)
            .join(",")}
          onChange={(e) => rhf.onChange(e.target.files?.[0])}
        />
      );

    default:
      return null;
  }
}
