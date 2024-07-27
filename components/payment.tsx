"use client"
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
interface Props {
    hasActiveSubscription: boolean
}
const Payment = ({ hasActiveSubscription }: Props) => {
    const [pending, startTransition] = useTransition()

    const onUpgrade = () => {
        startTransition(() => {
            createStripeUrl().then((response) => {
                if (response.data) {
                    window.location.href = response.data
                }
            }).catch(() => toast.error("Could not process payment"))

        })
    }
    return (
        <>
        {hasActiveSubscription ? (
        <Button asChild>
          <Link
            href="https://billing.stripe.com/p/login/28o003bn6ad065ieUU"
          >
            Settings
          </Link>
          </Button>

        ) : (
          <Button onClick={onUpgrade} disabled={pending}>
            Upgrade
          </Button>
        )}
      </>
    );
}

export default Payment;