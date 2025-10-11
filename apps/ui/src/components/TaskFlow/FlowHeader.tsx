import { Button } from "@/components/ui/button";

export function FlowHeader({
  mode,
  onPublish,
}: {
  mode: string;
  onPublish: () => void;
}) {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-between p-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        {mode === "edit" ? "Edit Task Flow" : "Create Task Flow"}
      </h1>
      <Button
        onClick={onPublish}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
      >
        Publish
      </Button>
    </header>
  );
}
