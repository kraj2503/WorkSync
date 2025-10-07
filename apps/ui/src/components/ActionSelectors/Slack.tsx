import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SlackSelector = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [channelId, setChannalId] = useState("");
  const [message, setMessage] = useState("");
  console.log("inside Slack selectroer");

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Channel Id"
        value={channelId}
        onChange={(e) => setChannalId(e.target.value)}
        className="mb-3"
      />
      <Input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={() => {
          setMetadata({
            channelId,
            message,
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default SlackSelector;
