import type { AuthUser, Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import supabase from "~/lib/supabase"

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  image: string;
};

type IAuthContext = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isAuthLoading: boolean;
  handleLogout: () => void;
};
export const defaultProvider: IAuthContext = {
  user: null,
  setUser: () => null,
  isAuthLoading: false,
  handleLogout: () => { },
};

export const AuthContext = createContext<IAuthContext | undefined>(
  defaultProvider
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthLoading(false);
      setSession(session);
      if (!session) {
        setUser(null);
        navigate("/login");
      } else {
        setUser(session.user);

      }
    }
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async(_event, session) => {
      console.log("_event", _event);
      console.log("session", session);
      setSession(session)
      if (!session) {
        setUser(null);
        navigate("/login")
        return;
      }

      setUser(session.user);

      if (_event === "SIGNED_IN" && session.user) {
        await supabase.auth.updateUser({
          data: {
            avatar: "/images/default-avatar.webp"
          },
        })
      }

      if (_event === "SIGNED_IN") {
        navigate("/");

      }
    }
    )
    return () => subscription.unsubscribe()
  }, [])



  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  var value = {
    user,
    setUser,
    isAuthLoading,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}