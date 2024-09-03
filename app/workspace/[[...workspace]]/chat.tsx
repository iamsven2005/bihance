"use client"
import { useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface Props{
    NAME: string
    orgId: string
}

export default function App({ NAME, orgId }: Props) {
  const messages = useQuery(api.messages.list, { orgId });  // Pass orgId here
  const sendMessage = useMutation(api.messages.send);

  const [newMessageText, setNewMessageText] = useState("");

   

  return (
    <Card >
      <CardContent>
        <CardTitle>Convex Chat</CardTitle>
        <CardDescription>
          Connected as <strong>{NAME}</strong>
        </CardDescription>
      </CardContent>
      {messages?.map((message) => (
        <div
          key={message._id}
          className={message.author === NAME ? "message-mine" : ""}
        >
          <div>{message.author}: {message.body}</div>
        </div>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText, author: NAME, orgId: orgId });
          setNewMessageText("");
        }}
        className="flex gap-2"
      >
        <Input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
        />
        <Button type="submit" disabled={!newMessageText}>
          Send
        </Button>
      </form>
    </Card>
  );
}