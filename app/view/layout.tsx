"use client"
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set isMounted to true once the component is mounted on the client
    setIsMounted(true);
  }, []);

  // Don't render the component until it's mounted on the client to prevent mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {/* Your JSX code */}
      {children}
    </div>
  );
}
