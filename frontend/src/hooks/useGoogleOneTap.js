import { useEffect } from "react";
import { apiRequest } from "../utils/api";
import { loadScript } from "../utils/loadScript";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export default function useGoogleOneTap({ enabled = true, onSuccess, onError }) {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!enabled || !clientId) {
      return undefined;
    }

    let isMounted = true;

    const initializeGoogleOneTap = async () => {
      try {
        await loadScript(GOOGLE_SCRIPT_SRC, "google-one-tap-script");

        if (!window.google?.accounts?.id || !isMounted) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const data = await apiRequest("/auth/google", {
                method: "POST",
                body: JSON.stringify({
                  credential: response.credential,
                }),
              });

              onSuccess?.(data);
            } catch (error) {
              onError?.(error.message);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt();
      } catch (error) {
        onError?.(error.message);
      }
    };

    initializeGoogleOneTap();

    return () => {
      isMounted = false;
      window.google?.accounts?.id?.cancel();
    };
  }, [enabled, onError, onSuccess]);
}
