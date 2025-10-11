"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@repo/config";
import { useAuth } from "@/app/providers/AuthProvider";

import { ActionList } from "./actionsList";
import { TriggerSelector } from "./TriggerSelector";
import { FlowHeader } from "./FlowHeader";
import ActionModal from "./actionModal";
import { useActionsAndTriggers, useAvailableActionsandTriggers } from "./hooks";

export default function TaskFlow({
  mode,
  taskId,
}: {
  mode: "create" | "edit";
  taskId?: string;
}) {
  const { userId, session: accessToken } = useAuth();
  const router = useRouter();
  const { availableActions, availableTrigger } =
    useAvailableActionsandTriggers();

  const { trigger: existingTrigger, actions: existingActions } =
    useActionsAndTriggers(mode === "edit" ? taskId : undefined, accessToken);

  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedActions, setSelectedActions] = useState<any[]>([]);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [activeModalData, setActiveModalData] = useState<any>(null);

  useEffect(() => {
    if (existingTrigger)
      setSelectedTrigger({
        id: existingTrigger.id,
        name: existingTrigger.name,
      });
    if (existingActions) setSelectedActions(existingActions);
  }, [existingTrigger, existingActions]);

  const handlePublish = async () => {
    if (!accessToken || !userId || !selectedTrigger)
      return alert("Missing data");
  
  const payload =
      mode === "edit"
        ? {
            id: {
              userId: userId,
              taskId: taskId,
            },
            trigger: {
              availableTriggerId: selectedTrigger.id,
              triggerMetadata: {},
            },
            actions: selectedActions.map((action) => ({
              availableActionId: action.availableTaskId,
              order: action.index,
              actionMetadata: action.metadata,
            })),
          }
        : {
            trigger: {
              availableTriggerId: selectedTrigger.id,
              triggerMetadata: {},
            },
            actions: selectedActions.map((action) => ({
              availableActionId: action.availableTaskId,
              order: action.index,
              actionMetadata: action.metadata,
            })),
          };



    const endpoint = mode === "edit" ? "/update" : "/add";
    await axios.post(`${BACKEND_URL}/api/v1/task${endpoint}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-user-id": userId,
      },
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900">
      <FlowHeader mode={mode} onPublish={handlePublish} />
      <div className="w-full max-w-2xl mt-10 space-y-8">
        <TriggerSelector
          trigger={selectedTrigger}
          onSelect={(t) => setSelectedTrigger(t)}
          availableTrigger={availableTrigger}
        />
        <ActionList
          actions={selectedActions}
          onEdit={(action, index) => {
            setActiveModalIndex(index);
            setActiveModalData({ ...action, metadata: { ...action.metadata } });
          }}
          onAdd={() =>
            setSelectedActions((prev) => {
              const maxIndex =
                prev.length > 0 ? Math.max(...prev.map((a) => a.index)) : 0;
              return [
                ...prev,
                {
                  index: maxIndex + 1,
                  availableTaskId: "",
                  availableTaskName: "",
                  metadata: {}, 
                },
              ];
            })
          }
          onRemove={(index) =>
            setSelectedActions((prev) => prev.filter((a) => a.index !== index))
          }
        />
      </div>

      {activeModalIndex !== null && (
        <ActionModal
          index={activeModalIndex + 1}
          initialAction={activeModalData}
          availableItems={availableActions}
          onClose={() => setActiveModalIndex(null)}
          onSave={(updated) => {
            setSelectedActions((prev) =>
              prev.map((a) =>
                a.index === activeModalIndex
                  ? {
                      ...a,
                      availableTaskId: updated.id,
                      availableTaskName: updated.name,
                      metadata: { ...updated.metadata },
                    }
                  : a
              )
            );
            setActiveModalIndex(null);
          }}
        />
      )}
    </div>
  );
}
