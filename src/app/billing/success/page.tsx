import { Suspense } from "react";
import { BillingSuccessClient } from "@/components/billing/BillingSuccessClient";

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BillingSuccessClient />
    </Suspense>
  );
}
