import { SmartShieldApp } from "@/components/SmartShieldApp";

export default function Home() {
  return (
    <>
      <div className="ss-backdrop" aria-hidden>
        <div className="ss-grid" />
        <div className="ss-noise" />
      </div>
      <SmartShieldApp />
    </>
  );
}
