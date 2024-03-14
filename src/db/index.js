import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
export const client = postgres(process.env.DATABASE_URL_TWO);
export const db = drizzle(client);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
export const twilioClient = require("twilio")(
  process.env.NEXT_PUBLIC_TWILIOSID,
  process.env.NEXT_PUBLIC_TWILIOAUTHTOKEN
);
