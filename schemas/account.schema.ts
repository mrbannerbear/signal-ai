import * as z from "zod";

export const updateEmailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32, "Password must be at most 32 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const deleteAccountSchema = z.object({
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: "Please type DELETE to confirm",
  }),
  password: z.string().min(1, "Password is required for verification."),
});

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
