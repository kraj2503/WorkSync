"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Workflow, Plug, ArrowRight, CloudCog } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  return <LandingPage />;
}

function LandingPage() {
  const router = useRouter();

  const ToSignUp = () => {
    router.push("/auth/signUp");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-800 via-orange-800 to-indigo-500 text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 bg-clip-text text-transparent"
        >
          Automate Your Workflows Effortlessly
        </motion.h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-200">
          Connect apps, trigger workflows, and save time with powerful webhooks
          and integrations. Build automations that just work — no coding needed.
        </p>
        <div className="mt-8 flex gap-4">
          <Button
            className="rounded-2xl px-6 py-3 bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 text-white shadow-lg hover:opacity-90 transition"
            onClick={ToSignUp}
          >
            Get Started
          </Button>
          <Button variant="outline" className="rounded-2xl px-6 py-3">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-14">
          Why Choose Our Platform?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: <Zap className="w-8 h-8 text-purple-500" />,
              title: "Lightning Fast",
              desc: "Trigger workflows instantly with real-time webhooks.",
            },
            {
              icon: <Workflow className="w-8 h-8 text-orange-500" />,
              title: "Flexible Automation",
              desc: "Set up custom workflows that adapt to your needs.",
            },
            {
              icon: <Plug className="w-8 h-8 text-purple-500" />,
              title: "Integrations",
              desc: "Connect with popular apps and expand possibilities.",
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition hover:scale-105 duration-300 "
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{f.icon}</div>
                <h3 className="text-xl font-medium">{f.title}</h3>
                <p className="mt-2 text-gray-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations Showcase */}
      <div className="px-6 py-20 ">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Connect Your Favorite Apps
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["Slack", "Notion", "Github", "Gmail", "Trello"].map((app) => (
            <div
              key={app}
              className="px-6 py-3 bg-white rounded-xl shadow-sm border text-gray-700 font-medium hover:shadow-md transition hover:scale-115 duration-300"
            >
              {app}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block rounded-3xl bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 p-[2px]"
        >
          <div className="bg-white rounded-3xl px-10 py-12">
            <h2 className="text-3xl font-bold mb-4">
              Start Automating Today 🚀
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Save time, reduce manual work, and let automations handle the
              boring stuff for you.
            </p>
            <Button
              className="rounded-2xl px-6 py-3 bg-gradient-to-r from-purple-700  to-orange-500 text-white shadow-lg hover:opacity-90 transition flex items-center gap-2"
              onClick={ToSignUp}
            >
              Get Started Free <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
