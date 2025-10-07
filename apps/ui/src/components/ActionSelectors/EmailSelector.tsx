import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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



export default EmailSelector