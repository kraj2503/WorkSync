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
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string>("");
  // const [loading, tasks, error, userId] = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [taskNameToDelete, setTaskNameToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

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
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      setTasks(res.data.tasks || []);
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tasks"));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const openTask = (id: string) => {
    router.push(`/create/${id}`);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setTaskIdToDelete(id);
    setTaskNameToDelete(name);
    setIsModalOpen(true);
  };
  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskIdToDelete(null);
    setTaskNameToDelete("");
  };

  // Function to call the API for deletion
  const deleteTask = async () => {
    if (!taskIdToDelete) return;

    try {
      setIsDeleting(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      await axios.delete(`${BACKEND_URL}/api/v1/task/${taskIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      toast.success(`Task "${taskNameToDelete}" successfully deleted.`);
      handleCloseModal();
      // Refetch tasks to update the list immediately
      await fetchTasks();
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete the task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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
        {!loading && !error && (
          <Tasks
            tasks={tasks}
            userId={userId}
            openTask={openTask}
            handleDeleteClick={handleDeleteClick}
          />
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={deleteTask}
        taskName={taskNameToDelete}
      />

      {/* Deleting Loading State Overlay */}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.8)] z-[1001] text-purple-600 text-xl font-semibold backdrop-blur-sm">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Deleting task...
        </div>
      )}
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

function Tasks({
  tasks,
  userId,
  openTask,
  handleDeleteClick,
}: {
  tasks: any[];
  userId: string;
  openTask: any;
  handleDeleteClick: (id: string, name: string) => void;
}) {
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
    <Table className="pr-6">
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
          <TableHead className="text-right font-semibold text-gray-700 w-[50px] pr-16">
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
                alt="trigger icon"
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
                        alt="action icon"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 italic">No actions</span>
              )}
            </TableCell>

            <TableCell className="flex items-center gap-2">
              <span className="truncate max-w-[220px] text-gray-600"></span>
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

            <TableCell className="text-right pr-6">
              <Button
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-90 rounded-lg"
                onClick={() => openTask(t.id)}
              >
                Edit
              </Button>
              <Button
                className="ml-3 bg-red-700 text-white hover:opacity-90 rounded-lg"
                onClick={() =>
                  handleDeleteClick(t.id, t.name || `Task ${idx + 1}`)
                }
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Modal component for delete confirmation.
 */
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  taskName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.7)] overflow-auto transition-opacity duration-300">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 relative transform transition-all duration-300 scale-100">
        <svg
          id="closeIcon"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
          viewBox="0 0 320.591 320.591"
          onClick={onClose}
        >
          <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
          <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
        </svg>

        <div className="my-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 fill-red-500 inline"
            viewBox="0 0 24 24"
          >
            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
          </svg>
          <div className="mt-6">
            <h4 className="text-slate-900 text-xl font-bold">
              Confirm Deletion
            </h4>
            <p className="text-sm text-slate-600 mt-3">
              Are you sure you want to delete the task:{" "}
              <strong className="text-red-600">{taskName}</strong>? This action
              cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-3 mt-8">
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600 active:bg-red-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            onClick={onConfirm}
          >
            Yes, Delete Task
          </Button>
          <Button
            id="closeButton"
            type="button"
            className="bg-gray-200 hover:bg-gray-300 active:bg-gray-200 text-slate-900 font-semibold rounded-lg shadow-md transition-colors duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
