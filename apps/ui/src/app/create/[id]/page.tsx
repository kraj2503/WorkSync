"use client";

import TaskFlow from "@/components/TaskFlowEditor";
import { useParams } from "next/navigation";

export default function TaskEdit() {
  const params = useParams<{ id: string }>();
  const taskId = params.id;
  return <TaskFlow mode="edit" taskId={taskId} />;
}
