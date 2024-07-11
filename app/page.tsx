import { Button } from "@/components/ui/button";
import WordRotate from "@/components/ui/rotate";
import TypingAnimation from "@/components/ui/typing";
import Image from "next/image";
import Link from "next/link";

const MainPage = () => {
  return ( 
  <div className="flex flex-col items-center justify-center mx-auto gap-5">
    <Image src="/logo.png"
    width={200}
    height={200}
    alt="Logo"/>
    <h1 className="font-bold text-5xl">Bihance</h1>
    <h1 className="text-xl">
      Your all-in-one
    </h1>
    <WordRotate
      className="text-4xl font-bold text-base-content h-20"
      words={["HR solution", "Payroll system"]}
    />
    <Link href="/event">
    <Button>
    View created events
    </Button>
    </Link>
    <Link href="/upload">
    <Button>
    Upload attendance
    </Button>
    </Link>
    <Link href="/attend">
    <Button>
    View attendance
    </Button>
    </Link>


  </div> );
}
 
export default MainPage;