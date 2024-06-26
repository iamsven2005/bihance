import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const MainPage = () => {
  return ( 
  <div className="flex flex-col items-center justify-center mx-auto hero-content">
    <Image src="/favicon.ico"
    width={100}
    height={100}
    alt="Logo"/>
    <h1 className="text-bold text-5xl">Bihance</h1>
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


  </div> );
}
 
export default MainPage;