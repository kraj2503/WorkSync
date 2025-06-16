"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@repo/config";

export default function Dashboard() {
  const router = useRouter();
  const [loading, task] = useTasks();

  function createNewWork() {
    router.push("/Create");
  }

  return (
    <div className="pt-8 flex justify-center">
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
          Authorization: localStorage.getItem("Auth")
        }
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
  return (
    <div className="space-y-4 mt-6">
      {task.length === 0 ? (
        <div className="text-gray-500">No tasks found.</div>
      ) : (
        task.map((t, idx) => (
          <div
            key={t.id || idx}
            className="p-4 bg-gray-100 rounded-xl shadow-sm border border-gray-300"
          >
            <div className="text-lg font-semibold mb-1">Task ID: {t.id}</div>

            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Trigger:</span>{" "}
              {t.trigger?.type?.name ?? "N/A"}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-medium">Actions:</span>
              <ul className="list-disc list-inside pl-2">
                {t.action.map((a: any) => (
                  <li key={a.id}>{a.action?.name ?? "Unknown Action"}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
