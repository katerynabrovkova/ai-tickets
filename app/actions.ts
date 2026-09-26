"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { runTicketAnalysis, type AnalysisErrorCode } from "@/lib/analyze-ticket";

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

export type AnalyzeTicketResult = { ok: true } | { ok: false; error: string };

const ANALYSIS_ERRORS: Record<AnalysisErrorCode | "not_found" | "db", string> = {
  missing_key:
    "AI-аналіз не налаштовано: відсутній ключ API. Зверніться до адміністратора.",
  auth: "Помилка доступу до AI-сервісу (невірний ключ API).",
  rate_limit: "Забагато запитів до AI. Спробуйте за хвилину.",
  network:
    "Не вдалося з'єднатися з AI-сервісом. Перевірте з'єднання і спробуйте ще раз.",
  api: "AI-сервіс тимчасово недоступний. Спробуйте пізніше.",
  unknown: "AI-сервіс тимчасово недоступний. Спробуйте пізніше.",
  invalid_output: "AI повернув некоректну відповідь. Спробуйте ще раз.",
  not_found: "Звернення не знайдено.",
  db: "Не вдалося зберегти результат аналізу.",
};

export async function analyzeTicket(id: number): Promise<AnalyzeTicketResult> {
  const parsedId = z.number().int().positive().safeParse(id);
  if (!parsedId.success) {
    return { ok: false, error: ANALYSIS_ERRORS.not_found };
  }

  let ticket;
  try {
    [ticket] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, parsedId.data));
  } catch (error) {
    console.error("Failed to load ticket", error);
    return { ok: false, error: ANALYSIS_ERRORS.db };
  }
  if (!ticket) {
    return { ok: false, error: ANALYSIS_ERRORS.not_found };
  }

  const result = await runTicketAnalysis(ticket);
  if (!result.ok) {
    return { ok: false, error: ANALYSIS_ERRORS[result.error] };
  }

  try {
    await db
      .update(tickets)
      .set({
        priority: result.data.priority,
        category: result.data.category,
        summary: result.data.summary,
        draftReply: result.data.draft_reply,
        analyzedAt: new Date(),
      })
      .where(eq(tickets.id, ticket.id));
  } catch (error) {
    console.error("Failed to save ticket analysis", error);
    return { ok: false, error: ANALYSIS_ERRORS.db };
  }

  revalidatePath("/");
  return { ok: true };
}
