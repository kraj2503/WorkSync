"use client";
import { useState } from "react";
import Appbar from "../components/Appbar";
import { TaskCell } from "../components/taskCell";
import { Button } from "@/components/ui/button";

export default function TaskFlow() {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState<
    {
      availableActionId: string;
      availableActionName: string;
    }[]
  >([]);

  return (
    <>
      {/* <Appbar /> */}
      <div className="flex justify-center flex-col min-h-screen">
        <div className="flex justify-center w-full">
          <TaskCell name={selectedTrigger || "Trigger"} index={1} />
        </div>
       
          {selectedAction.map((action, index) => (
           <div className="flex justify-center w-full mt-5">
              <TaskCell
              key={action.availableActionId}
              name={action.availableActionName || "Action"}
              index={2 + index}
              />
              </div>
          ))}
        <Button variant={"link"}
          onClick={() => {
            setSelectedAction((a) => [
              ...a,
              {
                availableActionId: "",
                availableActionName: "",
              },
            ]);
          }}
              ><div className="text-2xl">
                      
          +
        </div>
        </Button>
      </div>
    </>
  );
}
