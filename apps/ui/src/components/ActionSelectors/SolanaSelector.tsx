// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";

// const SolanaSelector = ({
//   setMetadata,
// }: {
//   setMetadata: (params: any) => void;
// }) => {
//   const [address, setAddress] = useState("");
//   const [amount, setAmount] = useState("");
//   console.log("inside Solana selectroer");

//   return (
//     <div className="p-4">
//       <Input
//         type="text"
//         placeholder="Wallet Address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         className="mb-3"
//       />
//       <Input
//         type="number"
//         placeholder="Amount (SOL)"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="mb-3"
//       />

//       <Button
//         onClick={() => {
//           setMetadata({
//             address,
//             amount,
//           });
//         }}
//       >
//         Submit
//       </Button>
//     </div>
//   );
// };


// export default SolanaSelector

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface BlockField {
  type: string;
  text: string;
}

interface SlackBlockMetadata {
    channelId: string;
  headerText: string;
  fields: BlockField[];
  contextText?: string;
  buttons?: { text: string; value: string; style?: "primary" | "danger" }[];
}

const SlackBlockBuilder = ({
  setMetadata,
}: {
  setMetadata: (metadata: SlackBlockMetadata) => void;
}) => {
  const [channelId, setChannelId] = useState("");
  const [header, setHeader] = useState("📝 New Message");
  const [fields, setFields] = useState<BlockField[]>([
    { type: "mrkdwn", text: "Field 1" },
  ]);
  const [context, setContext] = useState("");
  const [buttons, setButtons] = useState<{ text: string; value: string }[]>([]);

  // Add a new field
  const addField = () => setFields([...fields, { type: "mrkdwn", text: "" }]);

  // Update a specific field
  const updateField = (index: number, value: string) => {
    const updated = [...fields];
    updated[index].text = value;
    setFields(updated);
  };

  // Add a new button
  const addButton = () =>
    setButtons([...buttons, { text: "Button", value: "value" }]);

  const updateButton = (
    index: number,
    key: "text" | "value",
    value: string
  ) => {
    const updated = [...buttons];
    updated[index][key] = value;
    setButtons(updated);
  };

  return (
    <div className="p-4 space-y-4 border rounded-md bg-gray-50">
      <Input
        placeholder="Channel Id"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
      <Input
        placeholder="Header Text"
        value={header}
        onChange={(e) => setHeader(e.target.value)}
      />

      <div>
        <h3 className="font-semibold mb-2">Fields</h3>
        {fields.map((f, i) => (
          <Input
            key={i}
            placeholder={`Field ${i + 1}`}
            value={f.text}
            onChange={(e) => updateField(i, e.target.value)}
            className="mb-2"
          />
        ))}
        <Button onClick={addField} className="mb-3">
          + Add Field
        </Button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Context</h3>
        <Textarea
          placeholder="Optional context (small text below)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="mb-2"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Buttons</h3>
        {buttons.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder="Button Text"
              value={b.text}
              onChange={(e) => updateButton(i, "text", e.target.value)}
            />
            <Input
              placeholder="Button Value"
              value={b.value}
              onChange={(e) => updateButton(i, "value", e.target.value)}
            />
          </div>
        ))}
        <Button onClick={addButton} className="mb-3">
          + Add Button
        </Button>
      </div>

      <Button
        onClick={() =>
          setMetadata({
            channelId,
            headerText: header,
            fields,
            contextText: context || undefined,
            buttons: buttons.length > 0 ? buttons : undefined,
          })
        }
      >
        Submit Blocks
      </Button>
    </div>
  );
};

export default SlackBlockBuilder;
