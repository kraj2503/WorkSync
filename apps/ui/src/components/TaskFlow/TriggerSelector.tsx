import { Card } from "@/components/ui/card";

export function TriggerSelector({ trigger, availableTrigger, onSelect }) {
  return (
    <Card className="p-6 shadow-sm border border-gray-200 rounded-2xl bg-white">
      <h2 className="text-lg font-medium mb-4 text-gray-700">Select Trigger</h2>
      <div className="flex flex-wrap gap-3">
        {availableTrigger.map(({ id, name, image }) => (
          <button
            key={id}
            onClick={() => onSelect({ id, name })}
            className={`flex items-center gap-3 border rounded-xl p-3 hover:bg-indigo-50 ${
              trigger?.id === id
                ? "border-indigo-500 bg-indigo-100"
                : "border-gray-200"
            }`}
          >
            <img src={image} alt={name} className="w-6 h-6" />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
