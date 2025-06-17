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

export default function Dashboard() {
  const router = useRouter();
  const [loading, task] = useTasks();

  function createNewWork() {
    router.push("/Create");
  }

  return (
    <div className="pt-8 flex justify-center  h-full">
      <div className="max-w-screen-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">My tasks</div>
          <Button variant={"purple"} onClick={createNewWork}>
            Create
          </Button>
        </div>
        {loading ? "Loading..." : <Tasks task={task} />}
      </div>
    </div>
  );
}

function useTasks(): [boolean, any[]] {
  const [loading, setLoading] = useState(true);
  const [task, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/task/getTasks`, {
        headers: {
          Authorization: localStorage.getItem("Auth"),
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, task];
}
function Tasks({ task }: { task: any[] }) {
  const router = useRouter()
  function handleStatusToggle(taskId: string, newValue: boolean) {
    console.log("Toggle status for:", taskId, "New Value:", newValue);
    // 🔁 You can now call an API here or update local state if needed
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
        {task.map((t, idx) => (
          <TableRow
            className="cursor-pointer hover:bg-slate-200"
            key={t.id}
            onClick={() => router.push(`/task:${t.id}`)}
          >
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell>{t.trigger?.type?.name || "N/A"}</TableCell>
            <TableCell>
              <ul className="space-y-1">
                {t.action.map((a: any) => (
                  <li key={a.id}>{a.action?.name ?? "Unknown Action"}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell className="text-right">
              <input
                type="checkbox"
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
