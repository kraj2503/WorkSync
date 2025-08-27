"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@repo/supabaseclient";
import { Loader2, Mail } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!emailValue || !passwordValue) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen flex items-center justify-around px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full gap-12 items-center">
        {/* Left Side */}
        <div className="space-y-6 px-4">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-100">
            Automate smarter with{" "}
            <span className="bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 bg-clip-text text-transparent">
              WorkSync
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect your apps, orchestrate AI, and scale workflows without code.
          </p>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-400 space-y-1">
            <li>Integrate 8,000+ apps and 300+ AI tools</li>
            <li>Build workflows in minutes, not weeks</li>
            <li>Enjoy a 14-day free trial of premium features</li>
          </ul>
        </div>

        {/* Right Side: Login Card */}
        <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 hover:shadow-2xl transition rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Welcome back
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Login to your account to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="dark:text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="password" className="dark:text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Inline Error */}
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              )}

              <CardFooter className="flex flex-col gap-3 mt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 text-white"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full cursor-pointer flex items-center gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Mail size={18} />
                  Login with Google
                </Button>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <a
                    href="signUp"
                    className="underline font-medium hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    Sign up here
                  </a>
                </p>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
