export default function Footer() {
    return (
        <footer
            style={{
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
                background: "#0b1120",
                borderTop: "1px solid rgba(255,255,255,.06)",
                color: "#94a3b8",
                fontSize: "13px",
            }}
        >
            <span>
                © 2026 AgentFlow AI
            </span>

            <span>
                FastAPI • Ollama • RAG • React
            </span>

            <span>
                Enterprise AI Support Platform
            </span>
        </footer>
    );
}