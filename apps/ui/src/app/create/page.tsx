"use client";
import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { TaskCell } from "../components/taskCell";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@repo/config";
import axios from "axios";

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

export default function TaskFlow() {
  const { availableActions, availableTrigger } =
    useAvailableActionsandTriggers();
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  }>();
  const [selectedAction, setSelectedAction] = useState<
    {
      index: number;
      availableTaskId: string;
      availableTaskName: string;
    }[]
  >([]);

  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(
    null
  );

  return (
    <>
      {/* <Appbar /> */}
      <div className="flex justify-center flex-col min-h-screen">
        <div className="flex justify-center w-full">
          <TaskCell
            name={selectedTrigger?.name || "Trigger"}
            index={1}
            onClick={() => {
              setSelectedModelIndex(1);
            }}
          />
        </div>

        {selectedAction.map((action) => {
          return (
            <div
              key={`action-${action.index}`}
              className="flex justify-center w-full mt-5"
            >
              <TaskCell
                name={action.availableTaskName || "Action"}
                index={action.index}
                onClick={() => {
                  setSelectedModelIndex(action.index);
                }}
              />
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
              },
            ]);
          }}
        >
          <div className="text-2xl">+</div>
        </Button>
      </div>
      {selectedModelIndex && (
        <Model
          onSelect={(props: null | { name: string; id: string }) => {
            if (props === null) {
              setSelectedModelIndex(null);
              return;
            }
            if (selectedModelIndex === 1) {
              setSelectedTrigger({
                id: props.id,
                name: props.name,
              });
            } else {
              setSelectedAction((prevActions) =>
                prevActions.map((action) =>
                  action.index === selectedModelIndex
                    ? {
                        ...action,
                        availableTaskId: props.id,
                        availableTaskName: props.name,
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
}: {
  index: number;
  onSelect: (props: null | { name: string; id: string }) => void;
  availableItems: {
    id: string;
    name: string;
    image: string;
  }[];
}) {
  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button

        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {index === 1 ? "Trigger" : "Actions"}
              </h3>
              <button
                onClick={() => {
                  onSelect(null);
                }}
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
            {availableItems.map(({ id, name, image }) => {
              return (
                <div 
                  key={id}
                  onClick={() => {
                    onSelect({
                      id,
                      name,
                    });
                  }}
                  className="flex border cursor-pointer hover:bg-slate-200 p-5 rounded-xl"
                >
                  <img src={image} width={30} />
                  <div id={id}>{name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
