"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@repo/supabaseclient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Appbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, setUser } = useAuth();

  const isLogin = pathname === "/auth/login";
  const isSignUp = pathname === "/auth/signUp";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const navigate = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

 return (
   <header className="w-full bg-gradient-to-r from-indigo-600 via-orange-400 to-indigo-600 shadow-md">
     <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
       {/* Left side: Logo + Dashboard */}
       <div className="flex items-center gap-4">
         <div
           className="text-2xl font-extrabold text-white cursor-pointer hover:scale-105 transition-transform ml-12"
           onClick={() => router.push("/")}
         >
           WorkSync
         </div>
       </div>
       <div className="flex justify-between ">
         <div>
           {user && (
             <Button
               onClick={() => navigate("/dashboard")}
               className={toggleButton}
             >
               Dashboard
             </Button>
           )}
         </div>
         <div>
           <Button
             onClick={() => navigate("/Features")}
             className={toggleButton}
           >
             Features
           </Button>
         </div>
         <div>
           <Button
             onClick={() => navigate("/Pricing")}
             className={toggleButton}
           >
             Pricing
           </Button>
         </div>
         <div>
           <Button onClick={() => navigate("/About")} className={toggleButton}>
             About
           </Button>
         </div>
       </div>

       {/* Right side: Auth buttons or user info */}
       <nav className="hidden md:flex items-center gap-4">
         {!user ? (
           <>
             <AuthButton
               label="Login"
               active={isLogin}
               onClick={() => navigate("/auth/login")}
             />
             <AuthButton
               label="Sign Up"
               active={isSignUp}
               onClick={() => navigate("/auth/signUp")}
             />
           </>
         ) : (
           <>
             <span className="text-white font-medium">
               Hi, {user.user_metadata?.name || user.email}
             </span>
             <Button
               onClick={handleLogout}
               className="bg-white text-indigo-600 hover:bg-gray-200 rounded-xl px-5 font-semibold"
             >
               Logout
             </Button>
           </>
         )}
       </nav>
     </div>
   </header>
 );
}

// Desktop & Mobile Auth Buttons
function AuthButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={`rounded-xl px-5 font-semibold transition-colors ${
        active
          ? "bg-white text-indigo-600"
          : "bg-transparent text-white hover:bg-white/20"
      }`}
    >
      {label}
    </Button>
  );
}




const toggleButton = `bg-white text-indigo-600 hover:bg-gray-100 rounded-xl px-5 font-semibold mr-2`;