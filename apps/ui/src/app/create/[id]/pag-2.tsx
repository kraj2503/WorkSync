import TaskFlowEditor from "@/components/TaskFlowEditor";

export default function EditPage({ params }: { params: { id: string } }) {
  return <TaskFlowEditor mode="edit" taskId={params.id} />;
}
