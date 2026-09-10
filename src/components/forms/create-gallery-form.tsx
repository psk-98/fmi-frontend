"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest } from "@/lib/api";
import {
  createGallerySchema,
  galleryResponseSchema,
  type CreateGalleryValues,
  type Gallery,
} from "@/lib/schemas";

export function CreateGalleryForm({
  onCreated,
}: {
  onCreated: (gallery: Gallery) => void;
}) {
  const form = useForm<CreateGalleryValues>({
    resolver: zodResolver(createGallerySchema),
    defaultValues: { name: "", description: "", visibility: "private" },
  });

  async function submit(values: CreateGalleryValues) {
    form.clearErrors("root");

    try {
      const payload = await apiRequest<unknown>("galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const parsed = galleryResponseSchema.parse(payload);
      onCreated(parsed.data);
      form.reset();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Could not create the gallery.",
      });
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="grid gap-4"
      noValidate
    >
      <Field
        label="Gallery name"
        htmlFor="gallery-name"
        error={form.formState.errors.name?.message}
      >
        <Input
          id="gallery-name"
          placeholder="Neon dreams & portraits"
          {...form.register("name")}
        />
      </Field>
      <Field
        label="Description"
        htmlFor="gallery-description"
        error={form.formState.errors.description?.message}
      >
        <Textarea
          id="gallery-description"
          placeholder="Describe the visual language of this collection."
          {...form.register("description")}
        />
      </Field>
      <Field
        label="Visibility"
        htmlFor="gallery-visibility"
        error={form.formState.errors.visibility?.message}
      >
        <select
          id="gallery-visibility"
          className="h-13 w-full min-w-0 rounded-xl border border-transparent bg-[#eaf5ff] px-4 text-sm text-[#091e29] outline-none focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20"
          {...form.register("visibility")}
        >
          <option value="private">Private — only you and moderators</option>
          <option value="public">
            Public — approved images can be explored
          </option>
        </select>
      </Field>
      {form.formState.errors.root?.message ? (
        <p className="text-xs text-[#ba1a1a]">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <Button
        type="submit"
        className="mt-1 w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Plus />
        )}
        Create gallery
      </Button>
    </form>
  );
}
