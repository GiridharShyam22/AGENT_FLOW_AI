import { useState, useRef, useEffect } from "react";
import { sendMessageStream } from "../api/chatApi";

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function useChat({ activeSessionId, initialMessages, onMessagesChange }) {
    const [messages, setMessages] = useState(initialMessages || [
        {
            role: "assistant",
            content: "👋 Welcome to AgentFlow AI. Ask me anything about your knowledge base.",
            time: getCurrentTime(),
        },
    ]);

    // Update local state when active session changes
    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        } else {
            setMessages([{
                role: "assistant",
                content: "👋 Welcome to AgentFlow AI. Ask me anything about your knowledge base.",
                time: getCurrentTime(),
            }]);
        }
    }, [activeSessionId]);

    // Push changes upstream
    useEffect(() => {
        if (onMessagesChange) {
            onMessagesChange(messages);
        }
    }, [messages]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");

    // RAG insight state
    const [confidence, setConfidence] = useState(null);
    const [sources, setSources]       = useState([]);
    const [isOnTopic, setIsOnTopic]   = useState(true);

    // Keep ref to abort function so we can cancel if needed
    const abortRef = useRef(null);

    /**
     * Core send — streams response token by token.
     * Appends a placeholder AI message, then patches it with each token.
     */
    async function _send(message) {
        const text = message?.trim();
        if (!text) return;

        // Cancel any in-progress stream
        if (abortRef.current) abortRef.current();

        // 1. Add user message
        setMessages(prev => [
            ...prev,
            { role: "user", content: text, time: getCurrentTime() },
        ]);
        setInput("");
        setError("");
        setIsTyping(true);

        // 2. Add empty AI placeholder
        const placeholderIdx = Date.now(); // unique key
        setMessages(prev => [
            ...prev,
            {
                role: "assistant",
                content: "",
                time: getCurrentTime(),
                _streaming: true,
                _key: placeholderIdx,
            },
        ]);

        // 3. Stream tokens — patch the placeholder message
        abortRef.current = sendMessageStream(
            text,
            // onToken — append each token to last assistant message
            (token) => {
                setMessages(prev => {
                    const copy = [...prev];
                    const last = copy[copy.length - 1];
                    if (last?.role === "assistant") {
                        copy[copy.length - 1] = {
                            ...last,
                            content: last.content + token,
                        };
                    }
                    return copy;
                });
            },
            // onDone — finalise metadata
            ({ sources: s, confidence: c, is_on_topic: t }) => {
                setIsTyping(false);
                setSources(s);
                setConfidence(c);
                setIsOnTopic(t);
                // Mark streaming complete
                setMessages(prev => {
                    const copy = [...prev];
                    const last = copy[copy.length - 1];
                    if (last?.role === "assistant") {
                        copy[copy.length - 1] = {
                            ...last,
                            sources: s,
                            confidence: c,
                            _streaming: false,
                        };
                    }
                    return copy;
                });
            },
            // onError
            (errMsg) => {
                setIsTyping(false);
                setError(errMsg);
                setMessages(prev => {
                    const copy = [...prev];
                    const last = copy[copy.length - 1];
                    if (last?.role === "assistant" && last._streaming) {
                        copy[copy.length - 1] = {
                            ...last,
                            content: "❌ Unable to connect to AgentFlow AI server.",
                            _streaming: false,
                        };
                    }
                    return copy;
                });
            }
        );
    }

    function handleSend() {
        _send(input);
    }

    function sendDirect(message) {
        _send(message);
    }

    function resetChat() {
        if (abortRef.current) abortRef.current();
        setMessages([{
            role: "assistant",
            content: "👋 Welcome to AgentFlow AI. Ask me anything about your knowledge base.",
            time: getCurrentTime(),
        }]);
        setInput("");
        setError("");
        setIsTyping(false);
        setSources([]);
        setConfidence(null);
        setIsOnTopic(true);
    }

    return {
        messages,
        input,
        setInput,
        handleSend,
        sendDirect,
        resetChat,
        isTyping,
        error,
        confidence,
        sources,
        isOnTopic,
    };
}