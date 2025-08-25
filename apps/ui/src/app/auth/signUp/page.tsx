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
import { Loader2, UserPlus, Mail } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!emailValue || !passwordValue) {
      setError("Email and password are required.");
      return;
    }
    if (passwordValue !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: emailValue,
      password: passwordValue,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/welcome`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      router.push("/check-email"); // Create a "Check your inbox" screen
    }

    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50 min-h-screen flex items-center justify-around px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-6 px-4">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Join{" "}
            <span className="bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 bg-clip-text text-transparent">
              WorkSync
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Create your free account and start building AI-powered workflows in
            minutes.
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Integrate 8,000+ apps and 300+ AI tools</li>
            <li>No coding required, just connect and go</li>
            <li>14-day trial of all premium features</li>
          </ul>
        </div>

        {/* Right Section: Sign Up Card */}
        <Card className="w-full max-w-md shadow-xl border border-gray-200 hover:shadow-2xl transition rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Create an account
            </CardTitle>
            <CardDescription>
              Enter your details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
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
                    "Sign Up"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full cursor-pointer flex items-center gap-2"
                >
                  <Mail size={18} />
                  Continue with Google
                </Button>

                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a
                    href="login"
                    className="underline font-medium hover:text-orange-600"
                  >
                    Login here
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
