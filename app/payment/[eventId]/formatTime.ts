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
  