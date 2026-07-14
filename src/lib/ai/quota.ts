import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { DAILY_AI_LIMIT } from "@/lib/assessment";

export async function reserveAiUsage(supabase: SupabaseClient, feature: "writing" | "speaking", idempotencyKey: string) {
  const { data, error } = await supabase.rpc("reserve_ai_usage", { feature_name: feature, request_key: idempotencyKey, daily_limit: DAILY_AI_LIMIT });
  if (error || !data) throw new Error(error?.message.includes("Daily assessment limit") ? "Daily assessment limit reached (5 per skill)." : "Assessment quota could not be reserved.");
  return data as string;
}

export async function finishAiUsage(supabase: SupabaseClient, reservationId: string, status: "succeeded" | "released", provider: string, model: string) {
  await supabase.rpc("finish_ai_usage", { reservation_uuid: reservationId, final_status: status, provider_name: provider, model_name: model });
}
