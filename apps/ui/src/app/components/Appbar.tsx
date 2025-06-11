"use client";
import { Button } from "../../components/ui/button";

import { usePathname, useRouter } from "next/navigation";

export default function Appbar() {
  const router = useRouter();
  const pathname = usePathname();
  const condition = pathname === "/signIn";
  // if (condition) return <></>;

  function PushSignin() {
    router.push("/signIn");
  }

  return (
    <div className="w-full  bg-gradient-to-r from-indigo-500 via-orange-400 to-indigo-500 h-auto">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-xl font-bold px-7 text-white">WorkSync</div>
        <div className="flex space-x-6">
          <div>
            <Button variant="home">Home</Button>
          </div>
          <div>
            <Button variant="home">Login</Button>
          </div>
          <div>
            <Button variant="signup" onClick={PushSignin}>
              Signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
