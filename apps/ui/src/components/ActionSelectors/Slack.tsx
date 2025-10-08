import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface BlockField {
  type: string;
  text: string;
}

export interface SlackBlockMetadata {
  channelId: string;
  headerText: string;
  fields: BlockField[];
  contextText?: string;
}

const SlackBlockBuilder = ({
  setMetadata,
  initialMetadata,
}: {
  setMetadata: (metadata: SlackBlockMetadata) => void;
  initialMetadata?: Partial<SlackBlockMetadata>; // <--- allow partial
}) => {
  const [channelId, setChannelId] = useState(initialMetadata?.channelId || "");
  const [header, setHeader] = useState(
    initialMetadata?.headerText || "📝 New Message"
  );
  const [fields, setFields] = useState<BlockField[]>(
    initialMetadata?.fields?.length
      ? initialMetadata.fields
      : [{ type: "mrkdwn", text: "Field 1" }]
  );
  const [context, setContext] = useState(initialMetadata?.contextText || "");

  useEffect(() => {
    if (initialMetadata?.channelId) setChannelId(initialMetadata.channelId);
    if (initialMetadata?.headerText) setHeader(initialMetadata.headerText);
    if (initialMetadata?.fields?.length) setFields(initialMetadata.fields);
    if (initialMetadata?.contextText) setContext(initialMetadata.contextText);
  }, [initialMetadata]);

  const addField = () => setFields([...fields, { type: "mrkdwn", text: "" }]);
  const updateField = (index: number, value: string) => {
    const updated = [...fields];
    updated[index].text = value;
    setFields(updated);
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
      <Button
        onClick={() =>
          setMetadata({
            channelId,
            headerText: header,
            fields,
            contextText: context || undefined,
          })
        }
      >
        Submit Blocks
      </Button>
    </div>
  );
};

export default SlackBlockBuilder;
