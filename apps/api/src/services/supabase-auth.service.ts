type SupabaseAuthUser = {
  id: string;
  email: string;
};

type SupabaseAuthConfig = {
  url: string;
  publishableKey: string;
};

function getSupabaseAuthConfig(): SupabaseAuthConfig {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase URL and publishable key must be configured for the API");
  }

  return { url: url.replace(/\/$/, ""), publishableKey };
}

function parseSupabaseAuthUser(user: unknown): SupabaseAuthUser {
  if (
    !user ||
    typeof user !== "object" ||
    !("id" in user) ||
    typeof user.id !== "string" ||
    !("email" in user) ||
    typeof user.email !== "string"
  ) {
    throw new Error("Supabase returned an invalid user response");
  }

  return { id: user.id, email: user.email };
}

export async function getSupabaseUser(
  accessToken: string,
): Promise<SupabaseAuthUser | null> {
  const { url, publishableKey } = getSupabaseAuthConfig();

  const response = await fetch(
    `${url}/auth/v1/user`,
    {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Supabase user lookup failed with status ${response.status}`);
  }

  return parseSupabaseAuthUser(await response.json());
}

export async function updateSupabaseUser(
  accessToken: string,
  updates: { email: string; name: string },
): Promise<SupabaseAuthUser | null> {
  const { url, publishableKey } = getSupabaseAuthConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: publishableKey,
      Authorization: ["Bearer", accessToken].join(" "),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: updates.email,
      data: { name: updates.name },
    }),
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Supabase user update failed with status ${response.status}`);
  }

  return parseSupabaseAuthUser(await response.json());
}
