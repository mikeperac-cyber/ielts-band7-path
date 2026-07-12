import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", padding: 20 }}>
      <WifiOff size={64} style={{ color: "var(--muted)", marginBottom: 24 }} />
      <h1>You are offline</h1>
      <p style={{ maxWidth: 400, color: "var(--text)", marginBottom: 24 }}>
        We couldn't reach the server. Connect to the internet to access new lessons and sync your progress.
      </p>
      <Link href="/" className="primary-button">
        Try again
      </Link>
    </div>
  );
}
