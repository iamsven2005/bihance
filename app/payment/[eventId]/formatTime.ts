import { db } from "@/lib/db";

export const formatTime = (date: Date): string => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  
    // Remove spaces and special characters
    return timeString.replace(/\s+/g, '').toLowerCase();
  };
  export const getUsername = async(id: string) => {
    const user = await db.user.findFirst({
      where:{
        clerkId: id
      }
    })
    const name = user?.first_name + " " + user?.last_name
    return name.toString()
  };
    