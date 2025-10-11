"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import EmailSelector from "../ActionSelectors/EmailSelector";
import SolanaSelector from "../ActionSelectors/SolanaSelector";
import SlackBlockBuilder from "../ActionSelectors/Slack";

interface ActionModalProps {
  index: number;
  initialAction: { id?: string; name?: string; metadata?: any };
  availableItems: { id: string; name: string; image: string }[];
  onClose: () => void;
  onSave: (updated: { id: string; name: string; metadata: any }) => void;
}

export default function ActionModal({
  index,
  initialAction,
  availableItems,
  onClose,
  onSave,
}: ActionModalProps) {
  const [step, setStep] = useState(0); // 0 = choose type, 1 = configure
  const [selectedAction, setSelectedAction] = useState(initialAction);

  console.log("index",index);
  
  useEffect(() => {
    setSelectedAction(initialAction);
  }, [initialAction]);

  const isTrigger = index === 1;

  const handleSelectActionType = (actionType: { id: string; name: string }) => {
    if (isTrigger) {
      onSave({ ...actionType, metadata: {} });
      onClose();
    } else {
      setSelectedAction({
        ...actionType,
        metadata: selectedAction.metadata || {},
      });
      setStep(1);
    }
  };

  const handleSaveMetadata = (metadata: any) => {
    onSave({ ...selectedAction, metadata });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-6">
        <DialogHeader>
          <DialogTitle>
            {isTrigger ? "Select Trigger" : "Configure Action"}
          </DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {availableItems.map(({ id, name, image }) => (
              <button
                key={id}
                onClick={() => handleSelectActionType({ id, name })}
                className={`flex flex-col items-center p-4 border rounded-xl hover:shadow-md transition ${
                  selectedAction.id === id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <img src={image} alt={name} className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && selectedAction.name && (
          <div className="mt-4">
            {selectedAction.name === "Send Email" && (
              <EmailSelector
                initialMetadata={selectedAction.metadata}
                setMetadata={handleSaveMetadata}
              />
            )}
            {selectedAction.name === "Solana" && (
              <SolanaSelector
                // initialMetadata={selectedAction.metadata}
                setMetadata={handleSaveMetadata}
              />
            )}
            {selectedAction.name === "Slack-Dm" && (
              <SlackBlockBuilder
                initialMetadata={selectedAction.metadata}
                setMetadata={handleSaveMetadata}
              />
            )}
          </div>
        )}

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          {step === 1 && (
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
