import "./styles/AIInsights.css";

export default function AIInsights() {
    return (
        <div className="insights">

            <h2>AI Insights</h2>

            <div className="insight-card">
                <div className="card-header">
                    <span>🎯 Confidence</span>
                </div>

                <div className="confidence-value">
                    96%
                </div>

                <div className="progress">
                    <div
                        className="progress-fill"
                        style={{ width: "96%" }}
                    />
                </div>
            </div>

            <div className="insight-card">

                <div className="card-header">
                    <span>📚 Retrieved Sources</span>
                </div>

                <ul className="sources-list">
                    <li>Knowledge Base FAQ</li>
                    <li>Support Documentation</li>
                    <li>RAG Search Results</li>
                </ul>

            </div>

            <div className="insight-card">

                <div className="card-header">
                    <span>⚡ System Status</span>
                </div>

                <div className="status-row">
                    <span>FastAPI</span>
                    <span className="status online">Online</span>
                </div>

                <div className="status-row">
                    <span>Ollama</span>
                    <span className="status online">Running</span>
                </div>

                <div className="status-row">
                    <span>RAG Engine</span>
                    <span className="status online">Ready</span>
                </div>

            </div>

            <div className="insight-card">

                <div className="card-header">
                    <span>📖 Knowledge Base</span>
                </div>

                <div className="kb-value">
                    20 FAQ Documents Indexed
                </div>

            </div>

        </div>
    );
}