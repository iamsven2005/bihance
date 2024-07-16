"use client"
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
interface Props{
    hasActiveSubscription: boolean
}
const Payment = ({hasActiveSubscription}: Props) => {
    const [pending, startTransition] = useTransition()

    const onUpgrade = () => {
        startTransition(()=>{
         createStripeUrl().then((response)=> {
            if (response.data) {
                window.location.href = response.data
            }
         }).catch(() => toast.error("Could not process payment"))

        })
    }
    return ( 
        <Button
                className="btn btn-primary"
                onClick={onUpgrade} disabled={pending || hasActiveSubscription}>
                    {hasActiveSubscription? "settings" : "upgrade"}
            
            </Button>
     );
}
 
export default Payment;