import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="page-wrap dashboard-page animate-pulse">
      <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ height: 48, width: 300, background: "var(--line)", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 20, width: 450, background: "var(--line)", borderRadius: 4 }} />
        </div>
        <div style={{ height: 36, width: 140, background: "var(--line)", borderRadius: 99 }} />
      </div>

      <section className="week-strip" style={{ height: 80, background: "var(--line)", opacity: 0.5, border: "none" }} />
      
      <section className="today-card" style={{ height: 320, background: "var(--paper)", opacity: 0.5 }} />

      <section className="panel" style={{ marginTop: 16, height: 240, background: "var(--paper)", opacity: 0.5 }} />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 40, color: "var(--muted)" }}>
        <Loader2 size={24} className="animate-spin" />
      </div>
    </div>
  );
}
