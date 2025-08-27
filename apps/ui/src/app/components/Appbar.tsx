"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@repo/supabaseclient";

export default function Appbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isLogin = pathname === "/auth/login";
  const isSignUp = pathname === "/auth/signIn";

  // fetch user session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-orange-400 to-indigo-600 shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="text-2xl font-extrabold text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          WorkSync
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {!user ? (
            <>
              <Button
                onClick={() => router.push("/auth/login")}
                className={`${
                  isLogin
                    ? "bg-white text-indigo-600 font-semibold"
                    : "bg-transparent text-white hover:bg-white/20"
                } rounded-xl px-5`}
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/auth/signUp")}
                className={`${
                  isSignUp
                    ? "bg-white text-orange-600 font-semibold"
                    : "bg-transparent text-white hover:bg-white/20"
                } rounded-xl px-5`}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4 text-white">
              <span className="font-medium">
                Hi, {user.user_metadata?.name || user.email}
              </span>
              <Button
                onClick={handleLogout}
                className="bg-white text-indigo-600 hover:bg-gray-100 rounded-xl px-5"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Menu
            className="text-white cursor-pointer"
            size={28}
            onClick={() => setMobileMenu(!mobileMenu)}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenu && (
        <div className="flex flex-col md:hidden bg-indigo-600 px-6 py-3 space-y-2">
          {!user ? (
            <>
              <Button
                onClick={() => {
                  router.push("/auth/login");
                  setMobileMenu(false);
                }}
                className="bg-transparent text-white hover:bg-white/20 rounded-xl"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  router.push("/auth/signIn");
                  setMobileMenu(false);
                }}
                className="bg-transparent text-white hover:bg-white/20 rounded-xl"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-white">
                Hi, {user.user_metadata?.name || user.email}
              </span>
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenu(false);
                }}
                className="bg-transparent text-white hover:bg-white/20 rounded-xl"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
