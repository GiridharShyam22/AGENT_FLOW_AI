const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Standard (non-streaming) chat — kept as fallback
 */
export async function sendMessage(message) {
    const selectedModel = localStorage.getItem("agentflow_model") || "llama3.2:latest";
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, model: selectedModel }),
    });

    if (!response.ok) {
        throw new Error("Failed to contact AI server.");
    }

    return await response.json();
}

/**
 * Streaming chat — calls /chat/stream and delivers tokens via callbacks.
 *
 * @param {string} message
 * @param {(token: string) => void} onToken  — called for every streamed token
 * @param {(meta: object) => void}  onDone   — called once with {sources, confidence, is_on_topic}
 * @param {(err: string) => void}   onError  — called on error
 * @returns {() => void} abort function
 */
export function sendMessageStream(message, onToken, onDone, onError) {
    const controller = new AbortController();

    (async () => {
        try {
            const selectedModel = localStorage.getItem("agentflow_model") || "llama3.2:latest";
            const response = await fetch(`${API_URL}/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, model: selectedModel }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error("Failed to contact AI server.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Parse SSE lines
                const lines = buffer.split("\n");
                buffer = lines.pop(); // keep incomplete line

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const raw = line.slice(6).trim();
                    if (!raw) continue;

                    try {
                        const event = JSON.parse(raw);
                        if (event.type === "token") {
                            onToken(event.content);
                        } else if (event.type === "done") {
                            onDone({
                                sources:      event.sources      ?? [],
                                confidence:   event.confidence   ?? 0,
                                is_on_topic:  event.is_on_topic  ?? true,
                            });
                        } else if (event.type === "error") {
                            onError(event.message || "Stream error");
                        }
                    } catch (_) {
                        // Ignore malformed SSE lines
                    }
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                onError(err.message || "Connection error");
            }
        }
    })();

    // Return abort function
    return () => controller.abort();
}