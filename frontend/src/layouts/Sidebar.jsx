import {
    Plus,
    MessageSquare,
    Database,
    BarChart3,
    Settings,
    Bot,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
    {
        icon: <Plus size={18} />,
        title: "New Chat",
        active: true,
    },
    {
        icon: <MessageSquare size={18} />,
        title: "Conversations",
    },
    {
        icon: <Database size={18} />,
        title: "Knowledge Base",
    },
    {
        icon: <BarChart3 size={18} />,
        title: "Analytics",
    },
    {
        icon: <Settings size={18} />,
        title: "Settings",
    },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            style={{
                width: isCollapsed ? "80px" : "260px",
                transition: "width 0.3s ease",
                background: "#0f172a",
                borderRight: "1px solid rgba(255,255,255,.06)",
                display: "flex",
                flexDirection: "column",
                padding: isCollapsed ? "24px 10px" : "24px 18px",
                position: "relative",
            }}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: "absolute",
                    right: "-12px",
                    top: "30px",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    zIndex: 10
                }}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "40px",
                    justifyContent: isCollapsed ? "center" : "flex-start",
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
                    <Bot
                        size={20}
                        color="white"
                    />
                </div>

                {!isCollapsed && (
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "700",
                            }}
                        >
                            Workspace
                        </h3>

                        <span
                            style={{
                                fontSize: "13px",
                                color: "#94a3b8",
                            }}
                        >
                            AgentFlow AI
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {menuItems.map((item) => (
                    <button
                        key={item.title}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "14px 16px",
                            borderRadius: "14px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 500,
                            transition: ".25s",
                            color: item.active
                                ? "#fff"
                                : "#cbd5e1",
                            background: item.active
                                ? "linear-gradient(135deg,#888888,#2563eb)"
                                : "transparent",
                        }}
                    >
                        {item.icon}
                        {item.title}
                    </button>
                ))}
            </div>

            <div
                style={{
                    marginTop: "auto",
                    padding: "18px",
                    borderRadius: "16px",
                    background: "#182136",
                    border: "1px solid rgba(255,255,255,.06)",
                }}
            >
                <h4
                    style={{
                        margin: 0,
                        marginBottom: "10px",
                        fontFamily: "var(--font-logo)",
                    }}
                >
                    AgentFlow AI
                </h4>

                <p
                    style={{
                        margin: 0,
                        color: "#94a3b8",
                        fontSize: "13px",
                        lineHeight: "1.6",
                    }}
                >
                    Offline AI Assistant powered by FastAPI, Ollama and RAG.
                </p>
            </div>
        </aside>
    );
}