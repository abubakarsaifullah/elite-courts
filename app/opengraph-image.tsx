import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Elite Courts premium sports facility in Lahore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #020617, #0f172a 45%, #083344)",
          color: "white",
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              height: "72px",
              width: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
              color: "#020617",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            EC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "24px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#a5f3fc" }}>
              Elite Courts
            </div>
            <div style={{ fontSize: "18px", color: "#cbd5e1" }}>Premium sports facility in Lahore</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "920px" }}>
          <div style={{ fontSize: "68px", lineHeight: 1.05, fontWeight: 700 }}>
            Premium Padel, Pickleball, Cricket, Badminton, and Table Tennis.
          </div>
          <div style={{ fontSize: "28px", color: "#cbd5e1" }}>
            Exact pricing, memberships, WhatsApp booking, and location details.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
