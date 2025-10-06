"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@repo/config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/providers/AuthProvider";
import { TaskCell } from "@/components/taskCell";


interface TaskFlowProps{
    mode: "create" | "edit";
    taskId?:string
}

export default function TaskFlow({ mode,taskId}:TaskFlowProps) {
//   const params = useParams<{ id: string }>();
  const { user: data, session: accessToken, userId } = useAuth();

  const { availableActions, availableTrigger } =
    useAvailableActionsandTriggers();
//   const taskId = params.id;

const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
}>();
const [selectedAction, setSelectedAction] = useState<
{
    index: number;
    availableTaskId: string;
    availableTaskName: string;
    metadata: any;
}[]
>([]);

const [selectedModalAction, setSelectedModalAction] = useState<{
    id?: string;
    name?: string;
    metadata?: any;
}>({});

const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(
    null
);

    const Router = useRouter();
    
    if (mode == "edit" && taskId) {
        const { trigger, actions } = useActionsAndTriggers(taskId, accessToken);
        

        
        useEffect(() => {
            if (trigger) {
                setSelectedTrigger({ id: trigger.id, name: trigger.name });
            }
            if (actions.length > 0) {
                setSelectedAction(actions);
            }
        }, [trigger, actions]);
    }
   const handleCreateFlow = async () => {
    if (!accessToken || !userId || !selectedTrigger) {
      console.error("Missing session or trigger data");
      return;
    }

    const payload = {
      trigger: {
        availableTriggerId: selectedTrigger.id,
        triggerMetadata: {},
      },
      actions: selectedAction.map((action) => ({
        availableActionId: action.availableTaskId,
        order: action.index,
        actionMetadata: action.metadata,
      })),
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/task/add`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-user-id": userId,
        },
      });
      alert("Task created");
      Router.push("/dashboard");
    } catch (err) {
      console.log("data sent", payload);
      console.error("Error creating task:", err);
    }
  };
     
  const handleUpdateFlow = async () => {

    if (!accessToken || !selectedTrigger) {
      console.error("Missing accessToken or trigger data");
      return;
    }

    const payload = {
      id: {
        userId: userId,
        taskId: taskId,
      },
      trigger: {
        availableTriggerId: selectedTrigger.id,
        triggerMetadata: {},
      },
      actions: selectedAction.map((action) => ({
        availableActionId: action.availableTaskId,
        order: action.index,
        actionMetadata: action.metadata,
      })),
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/task/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-user-id": userId,
          },
        }
      );
      alert("Task created");
      Router.push("/dashboard");
    } catch (err) {
      console.log("data sent", payload);
      console.error("Error creating task:", err);
    }
  };
  
  return (
    <>
      <div
        className="cursor-pointer bg-red-300 rounded flex justify-end "
              onClick={() => {
                  mode==="edit"? handleUpdateFlow():handleCreateFlow()
        }}
      >
        Publish
      </div>
      <div className="flex justify-center flex-col min-h-screen">
        <div className="flex justify-center w-full">
          <TaskCell
            name={selectedTrigger?.name || "Trigger"}
            key={1}
            onClick={() => {
              setSelectedModelIndex(1);
            }}
          />
        </div>

        {selectedAction.map((action) => {
          return (
            <div className="relative flex justify-center w-full mt-5 group">
              <TaskCell
                key={action.index}
                name={action.availableTaskName || "Action"}
                onClick={() => {
                  const existing = selectedAction.find(
                    (a) => a.index === action.index
                  );

                  console.log("Opening modal for action:", existing);

                  setSelectedModelIndex(action.index); // open modal
                  setSelectedModalAction({
                    id: existing?.availableTaskId,
                    name: existing?.availableTaskName,
                    metadata: existing?.metadata || {},
                  });
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAction((prev) =>
                    prev.filter((a) => a.index !== action.index)
                  );
                }}
                className="absolute top-1/2 right-[35%] -translate-y-1/2 bg-white text-gray-500 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          );
        })}
        <Button
          variant={"link"}
          onClick={() => {
            setSelectedAction((a) => [
              ...a,
              {
                index: a.length + 2,
                availableTaskId: "",
                availableTaskName: "",
                metadata: {},
              },
            ]);
          }}
        >
          <div className="text-2xl">+</div>
        </Button>
      </div>
      {selectedModelIndex && (
        <Model
          initialAction={selectedModalAction}
          onSelect={(
            props: null | { name: string; id: string; metadata: any }
          ) => {
            if (!props) {
              setSelectedModelIndex(null);
              return;
            }

            if (selectedModelIndex === 1) {
              setSelectedTrigger({
                id: props.id,
                name: props.name,
              });
            } else {
              // Update action with selected metadata from modal
              setSelectedAction((prevActions) =>
                prevActions.map((action) =>
                  action.index === selectedModelIndex
                    ? {
                        ...action,
                        availableTaskId: props.id,
                        availableTaskName: props.name,
                        metadata: props.metadata,
                      }
                    : action
                )
              );
            }

            setSelectedModelIndex(null); // Close the modal
          }}
          index={selectedModelIndex}
          availableItems={
            selectedModelIndex === 1 ? availableTrigger : availableActions
          }
        />
      )}
    </>
  );
}

function Model({
  index,
  onSelect,
  availableItems,
  initialAction, // <--- pass this from TaskFlow
}: {
  index: number;
  onSelect: (props: null | { name: string; id: string; metadata: any }) => void;
  availableItems: {
    id: string;
    name: string;
    image: string;
  }[];
  initialAction: { id?: string; name?: string; metadata?: any };
}) {
  console.log("Model opened with initialAction:", initialAction);
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState(initialAction);
  const isTrigger = index === 1;
  useEffect(() => {
    console.log("initialAction changed:", initialAction);
    setSelectedAction(initialAction);
  }, [initialAction]);
  // Reset step when modal closes
  const handleClose = () => {
    setStep(0);
    setSelectedAction({});
    onSelect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {index === 1 ? "Trigger" : "Actions"}
            </h3>
            <button
              onClick={handleClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="static-modal"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Conditional rendering based on step and selected action */}
          {step === 1 && selectedAction.name === "Send Email" && (
            <EmailSelector
              initialMetadata={selectedAction.metadata}
              setMetadata={(metadata) => {
                onSelect({
                  ...selectedAction,
                  metadata,
                } as { name: string; id: string; metadata: any });
              }}
            />
          )}

          {step === 1 && selectedAction.name === "solana" && (
            <SolanaSelector
              setMetadata={(metadata) => {
                onSelect({
                  ...selectedAction,
                  metadata,
                } as { name: string; id: string; metadata: any });
              }}
            />
          )}

          {step === 0 &&
            availableItems.map(({ id, name, image }) => {
              return (
                <div
                  key={id}
                  onClick={() => {
                    if (isTrigger) {
                      onSelect({
                        id,
                        name,
                        metadata: {},
                      });
                    } else {
                      setStep(1);
                      setSelectedAction({
                        id,
                        name,
                        metadata: selectedAction.metadata || {},
                      });
                    }
                  }}
                  className="flex border cursor-pointer hover:bg-slate-200 p-5 rounded-xl"
                >
                  <img src={image} width={30} alt={name} />
                  <div id={id}>{name}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const EmailSelector = ({
  setMetadata,
  initialMetadata = {},
}: {
  setMetadata: (params: any) => void;
  initialMetadata?: { email?: string; body?: string };
}) => {
  console.log("EmailSelector initialMetadata:", initialMetadata);

  const [email, setEmail] = useState(initialMetadata.email || "");
  const [body, setBody] = useState(initialMetadata.body || "");

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="To"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3"
      />
      <Input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={() => {
          setMetadata({
            email,
            body,
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const SolanaSelector = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mb-3"
      />
      <Input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={() => {
          setMetadata({
            address,
            amount,
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};



function useAvailableActionsandTriggers() {
  const [availableTrigger, setAvailableTrigger] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((x) => setAvailableTrigger(x.data));
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((x) => setAvailableActions(x.data));
  }, []);

  return {
    availableActions,
    availableTrigger,
  };
}
function useActionsAndTriggers(id: string, accessToken?: string | null) {
  const [trigger, setTrigger] = useState<{
    id: string;
    triggerId: string;
    name: string;
    metadata: any;
  } | null>(null);
  const [actions, setActions] = useState<
    {
      index: number;
      availableTaskId: string;
      availableTaskName: string;
      metadata: any;
    }[]
  >([]);

  useEffect(() => {
    if (!id || !accessToken) return;

    axios
      .get(`${BACKEND_URL}/api/v1/task/getTasks/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        const data = res.data.task[0];

        if (data.trigger) {
          console.log(data.trigger.id);

          setTrigger({
            id: data.trigger.id,
            triggerId: data.trigger.type.id,
            name: data.trigger.type.name,
            metadata: data.trigger.metadata || {},
          });
        }
        console.log(data.action);

        if (Array.isArray(data.action)) {
          setActions(
            data.action.map((a: any, idx: number) => ({
              index: idx + 2,
              availableTaskId: a.actionId,
              availableTaskName: a.action.name,
              metadata: a.metadata || {},
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching existing task flow:", err);
      });
  }, [id, accessToken]);
  console.log(`actions`, actions);

  return { trigger, actions };
}
