import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mfllhwcydjfmnefacrsl.supabase.co";
const supabaseAnonKey = "sb_publishable_bwd7b3fKq5VHdR1f3DhlCg_l6krMEgx";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
