import { redirect } from "next/navigation";
import { toast } from "sonner";


export const Redirect = () => {
    console.log("Please login")
    return redirect("/")
}