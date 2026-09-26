"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { tickets } from "@/db/schema";

const ticketSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Вкажіть ім'я клієнта")
    .max(100, "Ім'я не може бути довшим за 100 символів"),
  message: z
    .string()
    .trim()
    .min(1, "Вкажіть текст звернення")
    .max(5000, "Текст не може бути довшим за 5000 символів"),
});

export type CreateTicketState = {
  success: boolean;
  errors?: { customerName?: string[]; message?: string[] };
  formError?: string;
  values?: { customerName: string; message: string };
};

export async function createTicket(
  _prevState: CreateTicketState,
  formData: FormData,
): Promise<CreateTicketState> {
  const raw = {
    customerName: String(formData.get("customerName") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = ticketSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
    };
  }

  try {
    await db.insert(tickets).values(parsed.data);
  } catch (error) {
    console.error("Failed to create ticket", error);
    return {
      success: false,
      formError: "Не вдалося зберегти звернення. Спробуйте ще раз.",
      values: raw,
    };
  }

  revalidatePath("/");
  return { success: true };
}
