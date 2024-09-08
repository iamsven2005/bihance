"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChatComponentProps {
  orgId: string;
  orgname: string;
  username: string;
}

export const ChatComponent = ({ orgId, orgname, username }: ChatComponentProps) => {
  const router = useRouter();
  const messages = useQuery(api.messages.list, { orgId });
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");

  return (
    <Card>
      <CardContent>
        <div className="flex">
          <CardTitle>{orgname}</CardTitle>
          <Button
            onClick={() => {
              const callWindow = window.open(
                `/room/${orgId}`,
                'callWindow',
                'width=1200,height=800,left=200,top=100'
              );
              if (callWindow) {
                callWindow.focus();
              }
            }}
            className="flex-end"
          >
            Start Call <VideoIcon />
          </Button>
        </div>
        <CardDescription>Connected as {username}</CardDescription>
      </CardContent>
      {messages?.map((message) => (
        <div key={message._id} className={message.author === username ? "message-mine" : ""}>
          <div>{message.author}: {message.body}</div>
        </div>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText, author: username, orgId });
          setNewMessageText("");
        }}
        className="flex gap-2"
      >
        <Input
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Write a message…"
        />
        <Button type="submit" disabled={!newMessageText}>Send</Button>
      </form>
    </Card>
  );
};
