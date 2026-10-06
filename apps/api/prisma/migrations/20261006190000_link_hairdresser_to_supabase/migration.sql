ALTER TABLE "Hairdresser"
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "supabaseUserId" TEXT;

CREATE UNIQUE INDEX "Hairdresser_supabaseUserId_key"
  ON "Hairdresser"("supabaseUserId");
