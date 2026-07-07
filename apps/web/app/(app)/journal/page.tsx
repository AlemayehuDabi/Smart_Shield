import type { Metadata } from "next";
import { Suspense } from "react";
import { JournalView } from "@/components/journal/JournalView";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <Suspense fallback={null}>
      <JournalView />
    </Suspense>
  );
}
