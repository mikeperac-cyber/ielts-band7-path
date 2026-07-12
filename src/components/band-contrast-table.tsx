import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";

interface ContrastItem {
  band6: string;
  band7: string;
  reasoning: string;
}

interface BandContrastTableProps {
  contrasts: ContrastItem[];
}

export function BandContrastTable({ contrasts }: BandContrastTableProps) {
  if (!contrasts || contrasts.length === 0) return null;

  return (
    <div className="band-contrast-table" style={{ margin: "24px 0" }}>
      <h3 style={{ fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ background: "var(--blue)", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>Examiner's Lens</span>
        Why Band 6 stays Band 6
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {contrasts.map((item, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "stretch", background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <XCircle size={14} color="var(--red)" /> BAND 6.0
              </div>
              <p style={{ margin: 0, fontSize: 14 }}>"{item.band6}"</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", color: "var(--border)" }}>
              <ChevronRight size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={14} /> BAND 7.0+
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>"{item.band7}"</p>
            </div>
            
            <div style={{ gridColumn: "1 / -1", fontSize: 13, color: "var(--text)", background: "white", padding: "8px 12px", borderRadius: 6, borderLeft: "3px solid var(--blue)", marginTop: 8 }}>
              <strong>Why?</strong> {item.reasoning}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
