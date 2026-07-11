import AIInsights from "../components/insights/AIInsights";
import { useState, useRef } from "react";
import { Upload, Settings, Database } from "lucide-react";

export default function RightPanel() {
    return (
        <aside
            style={{
                width: "340px",
                background: "#0f172a",
                borderLeft: "1px solid rgba(255,255,255,.06)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "24px",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "700",
                    }}
                >
                    AI Insights
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#94a3b8",
                        fontSize: "14px",
                        lineHeight: "1.6",
                    }}
                >
                    Live retrieval information from the RAG pipeline.
                </p>
            </div>

            {/* Content */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                }}
            >
                <AIInsights />
                
                {/* Advanced Settings */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "white", fontWeight: "600" }}>
                        <Settings size={16} /> Model Settings
                    </div>
                    
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>Local LLM</label>
                    <select 
                        defaultValue="llama3.2:latest"
                        onChange={(e) => {
                            localStorage.setItem("agentflow_model", e.target.value);
                            // We can trigger a custom event or let useChat read this on next send
                            window.dispatchEvent(new Event("model_changed"));
                        }}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            color: "white",
                            outline: "none"
                        }}
                    >
                        <option value="llama3.2:latest">llama3.2:latest (Default)</option>
                        <option value="llama3.1">llama3.1</option>
                        <option value="mistral">mistral</option>
                        <option value="qwen2.5-coder">qwen2.5-coder</option>
                    </select>
                </div>

                {/* Dynamic RAG Upload */}
                <DynamicUpload />

            </div>
        </aside>
    );
}

function DynamicUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState("");
    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setStatus("Uploading & Chunking...");
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await fetch("http://0.0.0.0:8000/upload", {
                method: "POST",
                body: formData,
            });
            
            if (res.ok) {
                setStatus("✅ Added to Vector DB");
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setTimeout(() => setStatus(""), 3000);
            } else {
                setStatus("❌ Upload failed");
            }
        } catch (e) {
            setStatus("❌ Connection error");
        }
        setUploading(false);
    };

    return (
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "white", fontWeight: "600" }}>
                <Database size={16} /> Dynamic RAG
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", lineHeight: "1.5" }}>
                Upload a text file to dynamically add it to the agent's FAISS vector knowledge base.
            </p>
            
            <input 
                type="file" 
                accept=".txt,.md"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
                style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", width: "100%" }}
            />
            
            <button 
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                    width: "100%",
                    padding: "8px",
                    background: file ? (uploading ? "#334155" : "linear-gradient(135deg, #475569, #334155)") : "#1e293b",
                    color: file ? "white" : "#64748b",
                    border: "none",
                    borderRadius: "6px",
                    cursor: file && !uploading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "500",
                    transition: "all 0.2s"
                }}
            >
                <Upload size={14} /> {uploading ? "Processing..." : "Embed into Memory"}
            </button>
            
            {status && (
                <div style={{ marginTop: "12px", fontSize: "12px", color: status.includes("✅") ? "#4ade80" : "#f87171", textAlign: "center" }}>
                    {status}
                </div>
            )}
        </div>
    );
}