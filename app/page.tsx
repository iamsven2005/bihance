import LeafletMapComponent from "./Location";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Next.js App</h1>
      <LeafletMapComponent />
    </main>
  );
}
