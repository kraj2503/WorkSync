"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@repo/config";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@repo/supabaseclient";

export default function Dashboard() {
  const router = useRouter();
  const [loading, tasks] = useTasks();

  function createNewWork() {
    router.push("/Create");
  }

  return (
    <div className="pt-8 flex justify-center h-full">
      <div className="max-w-screen-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">My tasks</div>
          <Button variant={"purple" as any} onClick={createNewWork}>
            Create
          </Button>
        </div>
        {loading ? "Loading..." : <Tasks tasks={tasks} />}
      </div>
    </div>
  );
}

const getUserSessionData = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    console.log("Not in browser environment");
    return null;
  }

  // Try multiple possible localStorage keys for Supabase
  const possibleKeys = [
    "sb-htldxlpfuxywasrtrtqu-auth-token",
    "supabase.auth.token",
    "sb-auth-token",
  ];

  console.log("Checking localStorage keys...");

  // First, let's see all localStorage keys
  console.log("All localStorage keys:", Object.keys(localStorage));

  for (const key of possibleKeys) {
    try {
      console.log(`Trying key: ${key}`);
      const storedSession = localStorage.getItem(key);

      if (storedSession) {
        console.log(
          `Found data for key ${key}:`,
          storedSession.substring(0, 100) + "..."
        );
        const sessionData = JSON.parse(storedSession);

        const userId = sessionData.user?.id;
        const accessToken = sessionData.access_token;
        const email = sessionData.user?.email;

        console.log("Parsed session data:", {
          userId,
          email,
          hasAccessToken: !!accessToken,
        });

        if (accessToken) {
          return {
            userId,
            accessToken,
            email,
          };
        }
      }
    } catch (e) {
      console.error(
        `Failed to parse session data from localStorage key ${key}:`,
        e
      );
    }
  }

  // Alternative: Try using Supabase client directly
  console.log("Trying to get session from Supabase client...");
  try {
    // This is async, but let's try the sync version if available
    const session = supabase.auth.getSession();
    console.log("Supabase session:", session);
  } catch (e) {
    console.log("Could not get session from Supabase client:", e);
  }

  return null;
};

function useTasks(): [boolean, any[]] {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getSessionAndFetchTasks = async () => {
      try {
        // Method 1: Try Supabase's built-in session management
        console.log("Trying Supabase getSession...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          console.log("Found session via Supabase:", {
            userId: session.user?.id,
            email: session.user?.email,
            hasAccessToken: !!session.access_token,
          });

          await fetchTasks(session.access_token);
          return;
        }

        if (sessionError) {
          console.error("Supabase session error:", sessionError);
        }

        // Method 2: Try localStorage approach
        console.log("Trying localStorage approach...");
        const sessionInfo = getUserSessionData();

        if (sessionInfo?.accessToken) {
          console.log("Found session via localStorage");
          await fetchTasks(sessionInfo.accessToken);
          return;
        }

        // No session found
        console.log("No valid session found");
        setLoading(false);
        setTasks([]);
        setError(new Error("Authentication required. Please log in."));
      } catch (err) {
        console.error("Error in getSessionAndFetchTasks:", err);
        setLoading(false);
        setError(err as Error);
      }
    };

    const fetchTasks = async (accessToken: string) => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "Fetching tasks with token:",
          accessToken.substring(0, 20) + "..."
        );

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/task/getTasks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("API response:", response.data);
        setTasks(response.data.tasks || []);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch tasks."
        );
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    // Check if we're in browser environment
    if (typeof window !== "undefined") {
      getSessionAndFetchTasks();
    } else {
      setLoading(false);
    }
  }, []);

  return [loading, tasks];
}

function Tasks({ tasks }: { tasks: any[] }) {
  const router = useRouter();

  function handleStatusToggle(taskId: string, newValue: boolean) {
    console.log("Toggle status for:", taskId, "New Value:", newValue);
    // TODO: Implement actual status update API call
  }

  // Handle empty tasks array
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Create your first task to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>Trigger</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t, idx) => (
          <TableRow
            className="cursor-pointer hover:bg-slate-200"
            key={t.id}
            onClick={() => router.push(`/task/${t.id}`)} // Fixed route format
          >
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell>{t.trigger?.type?.name || "N/A"}</TableCell>
            <TableCell>
              {t.action && t.action.length > 0 ? (
                <ul className="space-y-1">
                  {t.action.map((a: any) => (
                    <li key={a.id}>{a.action?.name ?? "Unknown Action"}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500">No actions</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <input
                type="checkbox"
                checked={t.status || false} // Assuming there's a status field
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleStatusToggle(t.id, e.target.checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
