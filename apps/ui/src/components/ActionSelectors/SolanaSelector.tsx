import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SolanaSelector = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  console.log("inside Solana selectroer");

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


export default SolanaSelector