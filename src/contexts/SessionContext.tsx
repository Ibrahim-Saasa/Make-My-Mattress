"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client"; // Import the client

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  supabase: typeof supabase;
  clearSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear session state
      setSession(null);
      // Clear all localStorage items related to Supabase
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.includes("supabase") ||
          key.includes("sb-") ||
          key.includes("auth")
        ) {
          localStorage.removeItem(key);
        }
      });
      // Clear sessionStorage too
      sessionStorage.clear();
      console.log("Session cleared successfully");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, isLoading, supabase, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};
