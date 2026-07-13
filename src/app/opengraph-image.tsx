import { ImageResponse } from "next/og";

export const alt = "IELTS Academic Band 9 Path — a 10-week self-study programme";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #062b50 0%, #0b5f9e 58%, #dceffd 58%, #f7fbff 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 690 }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
            IELTS ACADEMIC
          </div>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 72, fontWeight: 700, letterSpacing: -3, lineHeight: 1.08, marginTop: 38 }}>
            Build your Band 9 performance, one deliberate day at a time.
          </div>
          <div style={{ color: "#c9e6fb", display: "flex", fontSize: 28, marginTop: 32 }}>
            10-week self-study programme · Original practice audio · 20 timed mocks
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#ffffff",
            border: "10px solid #b8dff8",
            color: "#07345f",
            display: "flex",
            flexDirection: "column",
            height: 310,
            justifyContent: "center",
            width: 290,
          }}
        >
          <div style={{ color: "#0b68ad", display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>TARGET BAND</div>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 104, fontWeight: 700, lineHeight: 1, marginTop: 18 }}>7.0</div>
          <div style={{ color: "#5b7189", display: "flex", fontSize: 22, marginTop: 18 }}>Academic IELTS</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
