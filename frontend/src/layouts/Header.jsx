import { Bell, Search, Sparkles } from "lucide-react";

export default function Header() {
    return (
        <header
            style={{
                height: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                background: "#0b1120",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Logo */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background:
                            "linear-gradient(135deg,#888888,#2563eb)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Sparkles
                        size={20}
                        color="white"
                    />
                </div>

                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700,
                            fontFamily: "var(--font-logo)",
                        }}
                    >
                        AgentFlow AI
                    </h2>

                    <span
                        style={{
                            fontSize: "13px",
                            color: "#94a3b8",
                        }}
                    >
                        Enterprise AI Support Platform
                    </span>
                </div>
            </div>

            {/* Search */}

            <div
                style={{
                    width: "420px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#182136",
                    padding: "12px 18px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,.06)",
                }}
            >
                <Search
                    size={18}
                    color="#94a3b8"
                />

                <input
                    placeholder="Search conversations..."
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "white",
                        fontSize: "15px",
                    }}
                />
            </div>

            {/* Actions */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <button
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#182136",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    <Bell size={18} />
                </button>

                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg,#888888,#2563eb)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "white",
                    }}
                >
                    G
                </div>
            </div>
        </header>
    );
}