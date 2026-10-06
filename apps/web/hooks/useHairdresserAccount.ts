"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type AccountStatus = "checking" | "signedOut" | "signedIn" | "error";

export function useHairdresserAccount() {
  const [status, setStatus] = useState<AccountStatus>("checking");
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let active = true;
    let authEventHandled = false;
    let revision = 0;

    const verifySession = async (session: Session | null) => {
      const currentRevision = ++revision;
      const token = session?.access_token ?? "";
      setAccessToken(token);

      if (!token) {
        setUser(null);
        setStatus("signedOut");
        return;
      }

      setStatus("checking");

      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!active || currentRevision !== revision) return;

        if (error || !data.user) {
          if (error) {
            console.error("Unable to verify the signed-in account:", error);
          }
          setAccessToken("");
          setUser(null);
          setStatus(error ? "error" : "signedOut");
          return;
        }

        setUser(data.user);
        setStatus("signedIn");
      } catch (error) {
        if (!active || currentRevision !== revision) return;
        console.error("Unable to verify the signed-in account:", error);
        setAccessToken("");
        setUser(null);
        setStatus("error");
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventHandled = true;
      void verifySession(session);
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!active || authEventHandled) return;
        if (error) {
          console.error("Unable to load the current session:", error);
          setStatus("error");
          return;
        }
        void verifySession(session);
      })
      .catch((error: unknown) => {
        if (!active || authEventHandled) return;
        console.error("Unable to load the current session:", error);
        setStatus("error");
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { status, accessToken, user };
}
