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
import { toast } from "sonner"
import { supabase } from "@repo/supabaseclient";

export default function Dashboard() {
  const router = useRouter();
  const [loading, tasks, error,userId] = useTasks();

  return (
    <div className="pt-8 flex justify-center h-full">
      <div className="max-w-screen-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">My tasks</div>
          <Button variant={"purple" as any} onClick={() => router.push("/create")}>
            Create
          </Button>
        </div>

        {loading && <div>Loading...</div>}
        {!loading && error && <div className="text-red-500">{error.message}</div>}
        {!loading && !error && <Tasks tasks={tasks} userId={userId} />}
      </div>
    </div>
  );
}

function useTasks(): [boolean, any[], Error | null,string] {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [userId,setUserId] = useState<string|null>(null)
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
        setUserId(session.user.id)
        const res = await axios.get(`${BACKEND_URL}/api/v1/task/getTasks`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        setTasks(res.data.tasks || []);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Failed to fetch tasks"));
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return [loading, tasks, error,userId??""];
}

function Tasks({ tasks, userId }: { tasks: any[],userId:string }) {
  const router = useRouter();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Create your first task to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption />
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>Trigger</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>WebHook</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t, idx) => (
          <TableRow
            key={t.id}
            className="cursor-pointer hover:bg-slate-200"
            // onClick={() => router.push(`/task/${t.id}`)}
          >
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell>{t.trigger?.type?.name || "N/A"}</TableCell>
            <TableCell>
              {t.action?.length > 0 ? (
                <ul className="space-y-1">
                  {t.action.map((a: any) => (
                    <li key={a.id}>{a.action?.name ?? "Unknown Action"}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500">No actions</span>
              )}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <span className="truncate max-w-[200px]">
                {`${HOOKS_URL}/hooks/catch/${userId}/${t.id}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${HOOKS_URL}/hooks/catch/${userId}/${t.id}`
                  )
                  toast.success("Copied to clipboard");                  
                }}
              >
                Copy
              </Button>
            </TableCell>

            <TableCell className="text-right">
              <Button>Go</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
