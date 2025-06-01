import { Label } from "@radix-ui/react-label";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { ModeToggle } from "./toggle-theme";

export default function Hero({ user }) {
  return (
    <div className="mr-5">
      <div className="flex   justify-between">
        <div className="text-4xl font-extrabold text-accent-foreground mt-7 ml-15">
          Hey {user}, Welcome back...
        </div>
        <div className="flex justify-end ml-5 p-2">
         <ModeToggle/>
        </div>
      </div>
<div className="flex justify-end">

    <Button variant="headButton" type="button"> Create a new Automation </Button>
</div>

      {/* <div className="grid grid-cols-3 pt-10">
        <div className=" rounded-2xl h-lvh grid bg-blue-200 dark:bg-gray-700 text-accent-foreground m-4 p-2 text-xl font-semibold hover:border-2  dark:border-gray-300 hover:animate-in transition-transform tracking-wider  border-red-300">
          <div className="p-2 cursor-pointer">Create your own automation</div>
          <div>
            your 
          </div>
        </div>
        <div className="grid dark:bg-gray-600 m-4">
          hit your webhook with data
        </div>
        <div className="grid bg-gray-600 m-4">
          send Money and notify user via Email and SMS at the same time.
        </div>
      </div> */}

      {/* 
 <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
       
          <Button variant="link">Sign Up</Button>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card> */}
    </div>
  );
}
