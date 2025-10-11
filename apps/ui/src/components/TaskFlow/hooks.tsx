"use client"
import { BACKEND_URL } from "@repo/config";
import axios from "axios";
import { useEffect, useState } from "react";

interface TaskItem {
  index: number;
  availableTaskId: string;
  availableTaskName: string;
  metadata: any;
}


interface TaskTrigger {
  id: string;
  name: string;
}


interface AvailableItem {
  id: string;
  name: string;
  image: string;
}

export function useActionsAndTriggers(id: string, accessToken?: string | null) {
  const [trigger, setTrigger] = useState<TaskTrigger | null>(null);
  const [actions, setActions] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || !accessToken) {
      if (id) setIsLoading(false); // If taskId exists but token doesn't, stop loading
      return;
    }

    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/task/getTasks/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const data = res.data.task[0];
        if (data.trigger) {
          setTrigger({
            id: data.trigger.type.id, // Using type.id as the availableTriggerId
            name: data.trigger.type.name,
          });
        }

        if (Array.isArray(data.action)) {
          // Actions are mapped to the required structure for the state
          const mappedActions = data.action
            .sort((a: any, b: any) => a.order - b.order) // Ensure correct order
            .map((a: any, idx: number) => ({
              // Index starts at 2 for the first action (Trigger is 1)
              index: idx + 2,
              availableTaskId: a.action.id, // Using the action definition's ID
              availableTaskName: a.action.name,
              metadata: a.metadata || {},
            }));
          setActions(mappedActions);
        }
      })
      .catch((err) => {
        console.error("Error fetching existing task flow:", err);
      })
      .finally(() => setIsLoading(false));
  }, [id, accessToken]);

  return { trigger, actions, isLoading };
}


export function useAvailableActionsandTriggers() {
  const [availableTrigger, setAvailableTrigger] = useState<AvailableItem[]>([]);
  const [availableActions, setAvailableActions] = useState<AvailableItem[]>([]);

  useEffect(() => {
    // Fetch available triggers
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((x) => setAvailableTrigger(x.data))
      .catch((err) =>
        console.error("Failed to fetch available triggers:", err)
      );

    // Fetch available actions
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((x) => setAvailableActions(x.data))
      .catch((err) => console.error("Failed to fetch available actions:", err));
  }, []);

  return {
    availableActions,
    availableTrigger,
  };
}