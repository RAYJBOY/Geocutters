import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const getSupabaseEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabasePublishableKey || !supabaseUrl) {
    throw new Error("Missing supabase keys");
  }

  return { supabaseUrl, supabasePublishableKey };
};

export const createSupabaseServerClient = async () => {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnvVars();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have a proxy refreshing
          // user sessions.
        }
      },
    },
  });
};
