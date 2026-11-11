import { createClient } from "./client";

/**
 * Returns the Supabase client for data queries.
 * Safe for both Server Components and Client Components.
 */
export async function getSupabase() {
  return createClient();
}
