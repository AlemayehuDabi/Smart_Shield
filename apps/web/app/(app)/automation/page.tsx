import type { Metadata } from "next";
import { AutomationView } from "@/components/automation/AutomationView";

export const metadata: Metadata = { title: "Automation" };

export default function AutomationPage() {
  return <AutomationView />;
}
