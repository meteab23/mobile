import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="atmosphere flex min-h-screen items-center justify-center">
          <p className="text-muted">Loading checkout…</p>
        </main>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
