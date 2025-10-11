import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";

export function ActionList({ actions, onEdit, onAdd, onRemove }) {
  return (
    <Card className="p-6 border border-gray-200 rounded-2xl bg-white">
      <h2 className="text-lg font-medium mb-4 text-gray-700">Actions</h2>
      <div className="space-y-3">
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex justify-between items-center border p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
            onClick={() => onEdit(action, action.index)}
          >
            <span>{action.availableTaskName || "Select Action"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(action.index);
              }}
            >
              <Trash className="w-4 h-4 text-gray-500 hover:text-red-600" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> Add Action
      </Button>
    </Card>
  );
}
