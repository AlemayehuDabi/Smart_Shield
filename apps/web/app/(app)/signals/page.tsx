import type { Metadata } from "next";
import { SignalsView } from "@/components/signals/SignalsView";

export const metadata: Metadata = { title: "Signals" };

export default function SignalsPage() {
  return <SignalsView />;
}
