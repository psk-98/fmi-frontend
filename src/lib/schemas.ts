import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "moderator", "user"]),
  storage_used_bytes: z.number().int().nonnegative(),
  storage_quota_bytes: z.number().int().nonnegative(),
  storage_remaining_bytes: z.number().int().nonnegative(),
  created_at: z.string().nullable().optional(),
});

const galleryOwnerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email().nullish(),
  role: z.enum(["admin", "moderator", "user"]).nullish(),
  created_at: z.string().nullish(),
});

const gallerySummarySchema = z.object({
  uid: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  visibility: z.enum(["public", "private"]),
});

export const galleryImageSchema = z.object({
  uid: z.string(),
  url: z.string(),
  original_name: z.string().nullable().optional(),
  mime_type: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  file_size: z.number().nullable().optional(),
  celebrity_name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  face_count: z.number().optional(),
  processing_status: z.enum(["pending", "processing", "processed", "failed"]),
  moderation_status: z.enum(["pending", "approved", "rejected"]).optional(),
  is_public: z.boolean(),
  gallery: gallerySummarySchema.optional(),
  similarity: z.number().optional(),
  processed_at: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export const gallerySchema = gallerySummarySchema.extend({
  owner: galleryOwnerSchema.optional(),
  images_count: z.number().optional(),
  images: z.array(galleryImageSchema).default([]),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const galleryCollectionSchema = z.object({
  data: z.array(gallerySchema),
  meta: z.record(z.string(), z.unknown()).optional(),
  links: z.record(z.string(), z.unknown()).optional(),
});

export const galleryResponseSchema = z.object({ data: gallerySchema });
export const imageResponseSchema = z.object({ data: galleryImageSchema });
export const imageCollectionSchema = z.object({
  data: z.array(galleryImageSchema),
});
export const userResponseSchema = z.object({ data: userSchema });
export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(255),
    email: z.email("Enter a valid email address."),
    password: z.string().min(10, "Password must be at least 10 characters."),
    password_confirmation: z.string(),
    terms: z.boolean().refine((accepted) => accepted, "Accept the curation guidelines."),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export const createGallerySchema = z.object({
  name: z.string().trim().min(2, "Give your gallery a name.").max(255),
  description: z
    .string()
    .trim()
    .min(10, "Add at least 10 characters.")
    .max(2000),
  visibility: z.enum(["private", "public"]),
});

export const uploadImageSchema = z.object({
  images: z
    .array(
      z.custom<File>(
        (value): value is File =>
          typeof File !== "undefined" && value instanceof File,
        "Choose valid image files.",
      ),
    )
    .min(1, "Choose at least 1 image.")
    .max(5, "Choose no more than 5 images at once.")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      "Each image must be 10 MB or smaller.",
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        ),
      "Only JPG, PNG, and WebP images are supported.",
    ),
});

export const searchImageSchema = z.object({
  gallery_uid: z.string().min(1, "Choose a gallery to search."),
  image: z
    .custom<FileList>(
      (value): value is FileList =>
        typeof FileList !== "undefined" &&
        value instanceof FileList &&
        value.length === 1,
      "Choose a search image.",
    )
    .refine(
      (files) => !files?.[0] || files[0].size <= 10 * 1024 * 1024,
      "Maximum size is 10 MB.",
    ),
  limit: z.number().int().min(1).max(50),
});

export type User = z.infer<typeof userSchema>;
export type Gallery = z.infer<typeof gallerySchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type CreateGalleryValues = z.infer<typeof createGallerySchema>;
export type UploadImageValues = z.infer<typeof uploadImageSchema>;
export type SearchImageValues = z.infer<typeof searchImageSchema>;
