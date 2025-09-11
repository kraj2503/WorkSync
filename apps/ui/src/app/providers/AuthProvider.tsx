// app/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, JSX } from "react";
import { supabase } from "@repo/supabaseclient";

type AuthContextType = {
  user: any;
  loading: boolean;
  setUser: any;
  session:string,
  userId:string
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [session, setSession ] = useState<string>("")
  
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setUserId(session?.user?.id || "");
      setSession(session?.access_token||"");
      setLoading(false);
      
    };

    getSession();



    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, session, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
