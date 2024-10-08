"use client";

import { SetStateAction, useEffect, useState } from "react";
import {
  CarouselLayout,
  Chat,
  ChatEntry,
  ChatToggle,
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  Toast,
  TrackToggle,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const room = params.id;
  const [token, setToken] = useState("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);

  useEffect(() => {
    if (isUsernameSet && username !== "") {
      (async () => {
        try {
          const resp = await fetch(
            `/api/get-participant-token?room=${room}&username=${username}`
          );
          const data = await resp.json();
          setToken(data.token);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [isUsernameSet, username]);

  if (token === "") {
    if (!isUsernameSet) {
      return (
        <Dialog open={!isUsernameSet} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Your Username</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={username}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  if (username.trim() !== "") {
                    setIsUsernameSet(true);
                  } else {
                    alert("Please enter a valid username.");
                  }
                }}
              >
                Join Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return <Toast>Connecting...</Toast>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="m-5 w-full flex mx-auto flex-col "
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
    
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks}>
    <ParticipantTile />
    
  </GridLayout>
  );
}
