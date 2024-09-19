"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoIcon, SendIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [isLoading, setLoading] = useState("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      await sendMessage({ body: newMessageText, author: username, orgId });
      setNewMessageText("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleStartCall = () => {
    const callWindow = window.open(
      `/room/${orgId}`,
      'callWindow',
      'width=1200,height=800,left=200,top=100'
    );
    if (callWindow) {
      callWindow.focus();
    } else {
      toast.error("Unable to open call window. Please check your popup settings.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{orgname}</CardTitle>
        <Button onClick={handleStartCall} variant="outline" size="sm">
          <VideoIcon className="w-4 h-4 mr-2" />
          Start Call
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
          {messages && messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.author === username ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start ${
                  message.author === username ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.author[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 px-4 py-2 rounded-lg ${
                    message.author === username
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p className="text-sm font-medium">{message.author}</p>
                  <p>{message.body}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={!newMessageText.trim()}>
            <SendIcon className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};