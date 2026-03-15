const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid rgba(140, 113, 190, 0.18)",
            padding: "20px 40px",
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
            }}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "24px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}>
                    <img
                        src="/text_logo_dark.png"
                        alt="Owl-gorithms"
                        style={{ height: "28px" }}
                    />

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "8px",
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--muted-text)",
                        }}>
                            
                        </p>
                        <a href="mailto:info@kickit.com"
                            style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "var(--primary-cta)",
                                textDecoration: "none",
                                transition: "opacity 0.15s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                            info@kickit.com
                        </a>
                    </div>
                </div>
                
                <p style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "var(--muted-text)",
                }}>
                    © {CURRENT_YEAR} Owl-gorithms
                </p>

            </div>
        </footer>
    );
}