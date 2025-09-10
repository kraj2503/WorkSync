"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, HOOKS_URL } from "@repo/config";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@repo/supabaseclient";

export default function Dashboard() {
  const router = useRouter();
  const [loading, tasks, error, userId] = useTasks();
  console.log(tasks);

  const openTask = (id: string) => {
    
    router.push(`/create/${id}`);
  };
  return (
    <div className="pt-10 flex justify-center h-full bg-gradient-to-br from-purple-50 via-white to-orange-50 min-h-screen">
      <div className="max-w-screen-lg w-full bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            My Tasks
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-90 rounded-xl"
            onClick={() => router.push("/create")}
          >
            + Create Task
          </Button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 animate-pulse">
            Loading tasks...
          </div>
        )}
        {!loading && error && (
          <div className="text-red-500 text-center">{error.message}</div>
        )}
        {!loading && !error && <Tasks tasks={tasks} userId={userId} openTask={openTask}/>}
      </div>
    </div>
  );
}

function useTasks(): [boolean, any[], Error | null, string] {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Authentication required. Please log in.");
        }
        setUserId(session.user.id);

        const res = await axios.get(`${BACKEND_URL}/api/v1/task/getTasks`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        setTasks(res.data.tasks || []);
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tasks")
        );
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return [loading, tasks, error, userId ?? ""];
}

function Tasks({ tasks, userId, openTask }: { tasks: any[]; userId: string;  openTask:any}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-purple-300 rounded-xl">
        No tasks found. <br />{" "}
        <span className="text-sm text-gray-400">
          Create your first task to get started 🚀
        </span>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption className="text-gray-500">
        Manage and trigger your automation tasks easily
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-purple-100 to-orange-100">
          <TableHead className="w-[60px] font-semibold text-gray-700">
            #
          </TableHead>
          <TableHead className="font-semibold text-gray-700">Trigger</TableHead>
          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
          <TableHead className="font-semibold text-gray-700">Webhook</TableHead>
          <TableHead className="text-right font-semibold text-gray-700">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t, idx) => (
          <TableRow
            key={t.id}
            className="cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell>
              <img
                src={t.trigger?.type?.image}
                width={40}
                className="rounded-md shadow-sm"
              />
            </TableCell>
            <TableCell>
              {t.action?.length > 0 ? (
                <ul className="flex gap-2">
                  {t.action.map((a: any) => (
                    <li key={a.id}>
                      <img
                        src={a.action?.image}
                        width={30}
                        className="rounded-md shadow"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 italic">No actions</span>
              )}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <span className="truncate max-w-[220px] text-gray-600">
                {`${HOOKS_URL}/hooks/catch/${userId}/${t.id}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-400 text-purple-600 hover:bg-purple-100"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${HOOKS_URL}/hooks/catch/${userId}/${t.id}`
                  );
                  toast.success("Copied to clipboard");
                }}
              >
                Copy
              </Button>
            </TableCell>
            <TableCell className="text-right">
              <Button
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-90 rounded-lg"
                onClick={()=>openTask(t.id)}
              >
                Go
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
