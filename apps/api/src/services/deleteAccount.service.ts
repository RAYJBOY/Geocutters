import { prisma } from "../../lib/prisma.js";

export async function deleteSupabaseAccount(userId: string) {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured to delete accounts",
    );
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Supabase account deletion failed with status ${response.status}`,
    );
  }

  await prisma.hairdresser.deleteMany({
    where: { supabaseUserId: userId },
  });
}
