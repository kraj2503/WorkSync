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
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@repo/supabaseclient";

export default function SignIn() {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
Use Input validation and submit
        */
    setLoading(true);
    console.log(emailValue);
    console.log(passwordValue);

    const { data, error } = await supabase.auth.signUp({
      email: emailValue,
      password: passwordValue,

      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });
    console.log(data);

    if (error) {
      setError(error.message);
      alert(`Sign up failed: ${error.message}`);
    } else if (data.user) {
      alert(
        "Thanks for signing up! Please check your email for a confirmation link."
      );

    }



    setLoading(false);
  };
  if(loading)return<>loading</>
  return (
    <div className="bg-amber-50 min-h-screen flex items-center justify-around px-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full gap-12 items-center">
        <div className="space-y-6 px-4">
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            AI Automation starts and scales with{" "}
            <span className="text-orange-500">WorkSync</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Orchestrate AI across your teams, tools, and processes. Turn ideas
            into automated action today and power tomorrow's business growth.
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Integrate 8,000+ apps and 300+ AI tools without code</li>
            <li>Build AI-powered workflows in minutes, not weeks</li>
            <li>14-day trial of all premium features</li>
          </ul>
        </div>

        {/* Right Side: Login Card */}
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to access your workspace.
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
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={handlePasswordChange}
                />
              </div>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
                <Button variant="outline" className="w-full cursor-pointer">
                  Login with Google
                </Button>
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a href="/signUp" className="underline hover:text-orange-600">
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
